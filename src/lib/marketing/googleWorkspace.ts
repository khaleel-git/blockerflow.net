/**
 * Google Drive and Sheets for the private /marketing page, called straight from the
 * browser with the owner's own Google token (Google Identity Services, no server).
 * The token lives in this module's memory only and is gone when the tab closes.
 */
import { OWNER_EMAIL, OWNER_EMAILS, SHEET_ID, SHEET_TAB } from "./shortsAdmin";

/** OAuth web client whose allowed origins include https://blockerflow.net (Google Cloud console). */
// Project blockerflow-34d42, client "Blockerflow marketing page". Client IDs are public by design.
export const GOOGLE_CLIENT_ID: string =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "700188793100-s4er2a8g389j7li3e713id9i8oue4vea.apps.googleusercontent.com";

const SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
];

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}
interface GisWindow {
  google?: {
    accounts: {
      oauth2: {
        initTokenClient(cfg: Record<string, unknown>): { requestAccessToken(o?: Record<string, unknown>): void };
      };
    };
  };
}

let token: { value: string; expires: number } | null = null;
let gis: Promise<void> | null = null;

export class NeedsGoogleAccess extends Error {
  constructor() {
    super("Connect Google Drive first.");
  }
}

/** Loads Google's sign-in script. Call it early, so the click that signs in can open the popup straight away. */
export function loadGoogleSignIn(): Promise<void> {
  if ((window as GisWindow).google?.accounts?.oauth2) return Promise.resolve();
  gis ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      gis = null;
      reject(new Error("Could not load Google sign-in."));
    };
    document.head.appendChild(s);
  });
  return gis;
}

export const hasGoogleAccess = () => !!token && token.expires > Date.now();

/** Opens Google's permission popup (best from a click). Returns the email that signed in. */
export async function connectGoogle(): Promise<string> {
  if (!GOOGLE_CLIENT_ID) throw new Error("This build has no Google client ID (VITE_GOOGLE_CLIENT_ID).");
  await loadGoogleSignIn();
  const res = await new Promise<TokenResponse>((resolve, reject) => {
    const client = (window as GisWindow).google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES.join(" "),
      hint: OWNER_EMAIL,
      prompt: "",
      callback: (r: TokenResponse) => (r.error ? reject(new Error(r.error_description || r.error)) : resolve(r)),
      error_callback: (e: { type?: string; message?: string }) =>
        reject(new Error(e.type === "popup_failed_to_open" ? "The Google popup was blocked. Allow pop-ups for this site." : e.message || e.type || "Google sign-in failed")),
    });
    client.requestAccessToken();
  });
  if (!res.access_token) throw new Error("Google did not grant access to Drive.");
  // Google tokens last an hour; treat them as 55 minutes.
  const seconds = Math.min(res.expires_in ?? 3600, 3600) - 300;
  token = { value: res.access_token, expires: Date.now() + seconds * 1000 };
  const me = await (await call("https://www.googleapis.com/oauth2/v3/userinfo")).json();
  if (!OWNER_EMAILS.includes(me.email)) {
    token = null;
    throw new Error(`This page is only for ${OWNER_EMAILS.join(" or ")}.`);
  }
  return me.email as string;
}

/** The current Google token, for the Blockerflow Poster extension to fetch the video from Drive. */
export const googleAccessToken = () => (hasGoogleAccess() ? token!.value : "");

export const forgetGoogleAccess = () => {
  token = null;
};

async function call(url: string, init: RequestInit = {}): Promise<Response> {
  if (!hasGoogleAccess()) throw new NeedsGoogleAccess();
  const res = await fetch(url, { ...init, headers: { ...(init.headers || {}), Authorization: `Bearer ${token!.value}` } });
  if (res.status === 401) {
    token = null;
    throw new NeedsGoogleAccess();
  }
  if (!res.ok) {
    let msg = `${res.status}`;
    try {
      const j = await res.json();
      msg = j?.error?.message || msg;
    } catch {}
    throw new Error(`Google: ${msg}`);
  }
  return res;
}

const SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
const DRIVE = "https://www.googleapis.com/drive/v3/files";

export async function readSheet(): Promise<string[][]> {
  const res = await call(`${SHEETS}/values/${encodeURIComponent(`${SHEET_TAB}!A1:O`)}`);
  const j = await res.json();
  return (j.values as string[][]) ?? [];
}

export async function writeCells(range: string, values: string[][]): Promise<void> {
  await call(`${SHEETS}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ range, values }),
  });
}

export async function appendRows(rows: string[][]): Promise<void> {
  if (!rows.length) return;
  await call(`${SHEETS}/values/${encodeURIComponent(`${SHEET_TAB}!A1`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: rows }),
  });
}

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
}

export async function listChildren(folderId: string): Promise<DriveItem[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const res = await call(`${DRIVE}?q=${q}&fields=files(id,name,mimeType)&pageSize=200&orderBy=name`);
  return ((await res.json()).files as DriveItem[]) ?? [];
}

export const isFolder = (f: DriveItem) => f.mimeType === "application/vnd.google-apps.folder";

export async function downloadBlob(fileId: string): Promise<Blob> {
  const res = await call(`${DRIVE}/${fileId}?alt=media`);
  return res.blob();
}

export async function downloadText(fileId: string): Promise<string> {
  const res = await call(`${DRIVE}/${fileId}?alt=media`);
  return res.text();
}

/**
 * Moves a posted video's folder to the Drive bin. Returns false when Google refuses because the
 * signed-in account is an editor, not the owner (then the folder simply stays in Drive).
 */
export async function trashIfAllowed(fileId: string): Promise<boolean> {
  try {
    await trash(fileId);
    return true;
  } catch (e) {
    if (e instanceof Error && /\b403\b|insufficient|permission/i.test(e.message)) return false;
    throw e;
  }
}

/** Moves a file or folder to the Drive bin (Google keeps it there for 30 days). */
export async function trash(fileId: string): Promise<void> {
  await call(`${DRIVE}/${fileId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trashed: true }),
  });
}
