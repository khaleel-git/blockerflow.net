/**
 * The private /marketing page: shorts waiting in Google Drive, read from the
 * "Blockerflow Shorts Database" sheet. Pure helpers only; the Google calls live in
 * googleWorkspace.ts.
 */

/** The Blockerflow Chrome is signed in as blockerflow@gmail.com (an editor of the Drive folder); khaleel.eu owns it. */
export const OWNER_EMAILS = ["blockerflow@gmail.com", "khaleel.eu@gmail.com"];
export const OWNER_EMAIL = OWNER_EMAILS[0];
export const SHEET_ID = "1eAuMNVBtdBbY34ywm4j-JxoHepMqiLu68uKrH90QVMk";
export const SHEET_TAB = "Shorts";
/** blockerflow_videos/Shorts in Drive: one folder per theme, one folder per short inside it. */
export const SHORTS_FOLDER_ID = "1jwASwK9c9w6XeBEvUtRDRN_tErHSXmFj";
/** blockerflow_videos/Long-form: same layout; these go to YouTube only. */
export const LONGFORM_FOLDER_ID = "1pe1SI7CEkefb0sPNgsppyjq6PiJbjDL_";
/** Written into a platform cell when a video is not meant for that platform (long-form on Instagram/TikTok). */
export const NOT_FOR_PLATFORM = "n/a";

export type Platform = "youtube" | "instagram" | "tiktok";
export const PLATFORMS: Platform[] = ["youtube", "instagram", "tiktok"];

// Sheet columns (A = ID ... O = Status). Keep in step with the sheet's header row.
export const COL = {
  id: "A",
  theme: "B",
  title: "C",
  hook: "D",
  length: "E",
  publish: "F",
  review: "G",
  notes: "H",
  youtube: "I",
  instagram: "J",
  tiktok: "K",
  folder: "L",
  video: "M",
  added: "N",
  status: "O",
} as const;
export const HEADER = [
  "ID", "Theme", "Title", "Hook (caption in the video)", "Length (s)", "Suggested publish", "Review", "Review notes",
  "YouTube", "Instagram", "TikTok", "Drive folder", "Video file ID", "Added", "Status",
];

export const STATUS = {
  inDrive: "In Drive",
  posted: "Posted, removed from Drive",
  /** Posted, but the folder stayed: an editor account cannot move the owner's files to the bin. */
  postedKept: "Posted, still in Drive",
  deleted: "Deleted",
} as const;

export type Review = "Pending" | "Approved" | "Rejected";

export interface ShortRow {
  /** Row number in the sheet (the header is row 1). */
  row: number;
  id: string;
  theme: string;
  title: string;
  hook: string;
  length: string;
  publish: string;
  review: Review;
  notes: string;
  posted: Record<Platform, string>;
  folderId: string;
  videoId: string;
  added: string;
  status: string;
}

/** The folder id from a Drive folder link, or the value itself when it is already an id. */
export function folderIdFromUrl(url: string): string {
  const m = url.match(/folders\/([\w-]+)/);
  return m ? m[1] : url.trim();
}

const asReview = (v: string): Review => (v === "Approved" || v === "Rejected" ? v : "Pending");

/** Sheet values (header row first) to shorts. Rows without an ID are skipped. */
export function parseRows(values: string[][]): ShortRow[] {
  const out: ShortRow[] = [];
  values.slice(1).forEach((r, i) => {
    const c = (k: number) => String(r[k] ?? "").trim();
    if (!c(0)) return;
    out.push({
      row: i + 2,
      id: c(0),
      theme: c(1),
      title: c(2),
      hook: c(3),
      length: c(4),
      publish: c(5),
      review: asReview(c(6)),
      notes: c(7),
      posted: { youtube: c(8), instagram: c(9), tiktok: c(10) },
      folderId: folderIdFromUrl(c(11)),
      videoId: c(12),
      added: c(13),
      status: c(14) || STATUS.inDrive,
    });
  });
  return out;
}

export const isFullyPosted = (s: Pick<ShortRow, "posted">) => PLATFORMS.every((p) => !!s.posted[p]);
export const isInDrive = (s: Pick<ShortRow, "status">) => s.status === STATUS.inDrive;

/** A1 range of one cell of a short's row. */
export const cell = (row: number, col: keyof typeof COL) => `${SHEET_TAB}!${COL[col]}${row}`;

/** Where each upload button sends you. */
export const UPLOAD_URLS: Record<Platform, string> = {
  // The Blockerflow channel (@Get_BlockerFlow).
  youtube: "https://studio.youtube.com/channel/UCmncYGBlZlLWIm72rbBA0rA/videos/upload?d=ud",
  // Meta Business Suite posts the reel to Instagram and the Facebook page together.
  instagram: "https://business.facebook.com/latest/reels_composer?asset_id=1311303232077059&business_id=1820845332455010",
  tiktok: "https://www.tiktok.com/tiktokstudio/upload",
};

export const PLATFORM_NAMES: Record<Platform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
};

/** The text files next to each video in Drive. */
export interface ShortMeta {
  title: string;
  description: string;
  tags: string[];
  pinnedComment: string;
  caption: string;
}

export function parseMeta(youtubeMetaJson: string | null, caption: string | null, fallbackTitle: string): ShortMeta {
  let m: Record<string, unknown> = {};
  try {
    m = youtubeMetaJson ? JSON.parse(youtubeMetaJson) : {};
  } catch {
    m = {};
  }
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    title: str(m.title) || fallbackTitle,
    description: str(m.description),
    tags: Array.isArray(m.tags) ? m.tags.filter((t): t is string => typeof t === "string") : [],
    pinnedComment: str(m.pinned_comment),
    caption: (caption ?? "").trim(),
  };
}

export interface CopyField {
  label: string;
  text: string;
}

/**
 * What to paste on each platform, in the order you paste it. The first field goes to the
 * clipboard as soon as you press the upload button.
 */
export function copyFields(platform: Platform, meta: ShortMeta): CopyField[] {
  if (platform === "youtube") {
    return [
      { label: "Title", text: meta.title },
      { label: "Description", text: meta.description },
      { label: "Tags", text: meta.tags.join(", ") },
      { label: "Pinned comment", text: meta.pinnedComment },
    ].filter((f) => f.text);
  }
  // Instagram and TikTok take one caption; links don't work there, so the caption has none.
  const caption = meta.caption || [meta.title.replace(/\s*#shorts\b/i, ""), meta.description].filter(Boolean).join("\n\n");
  return [{ label: "Caption", text: caption }];
}

/** The file name the downloaded video gets. */
export const videoFileName = (id: string) => `${id}.mp4`;

/** A sheet row for a short found in Drive that the sheet doesn't know yet. */
export function newRow(opts: { id: string; theme: string; folderId: string; videoId: string; title: string; today: string; youtubeOnly?: boolean }): string[] {
  const r = Array(HEADER.length).fill("");
  if (opts.youtubeOnly) r[9] = r[10] = NOT_FOR_PLATFORM;
  r[0] = opts.id;
  r[1] = opts.theme;
  r[2] = opts.title;
  r[6] = "Pending";
  r[11] = `https://drive.google.com/drive/folders/${opts.folderId}`;
  r[12] = opts.videoId;
  r[13] = opts.today;
  r[14] = STATUS.inDrive;
  return r;
}

/** Today as YYYY-MM-DD in Berlin, which is what the sheet uses. */
export function today(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(now);
}
