/**
 * Scheduled posting for the /marketing page (opened as /marketing?autopost=1 by the scheduler
 * on the owner's Mac, see blockerflow/marketing/blockerflow-poster/scheduler). Posts every short that is
 * approved, still in Drive and past its "Suggested publish" time, through the Blockerflow Poster
 * extension, one platform at a time.
 */
import { downloadText, listChildren, trashIfAllowed, writeCells } from "./googleWorkspace";
import { onPostStatus, sendPostJob, type PostStatus } from "./posterBridge";
import {
  PLATFORMS, STATUS, cell, copyFields, isFullyPosted, isInDrive, parseMeta, today,
  type Platform, type ShortRow,
} from "./shortsAdmin";

/** "YYYY-MM-DD HH:MM" in Berlin time (what the sheet holds) to a Date, or null. */
export function berlinTime(value: string): Date | null {
  const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (!m) return null;
  const [y, mo, d, h, mi] = [+m[1], +m[2], +m[3], +(m[4] ?? 0), +(m[5] ?? 0)];
  // Guess UTC, read Berlin's offset at that moment, then correct (twice covers the DST switch).
  let t = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 2; i++) t = Date.UTC(y, mo - 1, d, h, mi) - berlinOffsetMs(new Date(t));
  return new Date(t);
}

function berlinOffsetMs(at: Date): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Berlin", timeZoneName: "shortOffset" })
    .formatToParts(at).find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
  const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (+m[2] * 60 + +(m[3] ?? 0)) * 60_000;
}

/** Shorts that should go out now: approved, in Drive, publish time passed, not on every platform yet. Oldest first. */
export function dueShorts(rows: ShortRow[], now = new Date(), max = 3): ShortRow[] {
  return rows
    .filter((s) => isInDrive(s) && s.review === "Approved" && !isFullyPosted(s))
    .map((s) => ({ s, at: berlinTime(s.publish) }))
    .filter((x): x is { s: ShortRow; at: Date } => !!x.at && x.at.getTime() <= now.getTime())
    .sort((a, b) => a.at.getTime() - b.at.getTime())
    .slice(0, max)
    .map((x) => x.s);
}

/** Writes the post date for one platform; once all are done the Drive folder goes to the bin (when this account may). */
export async function recordPosted(s: ShortRow, p: Platform, on = true): Promise<ShortRow> {
  const date = on ? today() : "";
  await writeCells(cell(s.row, p), [[date]]);
  const next = { ...s, posted: { ...s.posted, [p]: date } };
  if (on && isFullyPosted(next)) {
    const status = (await trashIfAllowed(s.folderId)) ? STATUS.posted : STATUS.postedKept;
    await writeCells(cell(s.row, "status"), [[status]]);
    next.status = status;
  }
  return next;
}

/** Resolves with the job's final status ("done" or "error"), or an error status after `timeoutMs`. */
export function waitForPost(jobId: string, platform: Platform, timeoutMs = 15 * 60_000): Promise<PostStatus> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      stop();
      resolve({ jobId, platform, state: "error", message: "No answer from Blockerflow Poster in time" });
    }, timeoutMs);
    const stop = onPostStatus(jobId, (st) => {
      if (st.state === "done" || st.state === "error") {
        clearTimeout(timer);
        stop();
        resolve(st);
      }
    });
  });
}

export interface AutoPostLog {
  (line: string): void;
}

/** Posts one short on every platform it is still missing. Returns the updated row. */
export async function postShort(s: ShortRow, token: string, log: AutoPostLog): Promise<ShortRow> {
  const files = await listChildren(s.folderId);
  const video = files.find((f) => f.mimeType.startsWith("video/"));
  if (!video) throw new Error(`${s.id}: no video in its Drive folder`);
  const metaFile = files.find((f) => f.name === "youtube_meta.json");
  const capFile = files.find((f) => f.name === "social_caption.txt");
  const thumb = files.find((f) => f.mimeType.startsWith("image/"));
  const meta = parseMeta(metaFile ? await downloadText(metaFile.id) : null, capFile ? await downloadText(capFile.id) : null, s.title);
  const youtube = copyFields("youtube", meta);
  const field = (label: string) => youtube.find((f) => f.label === label)?.text ?? "";
  let row = s;
  for (const p of PLATFORMS) {
    if (row.posted[p]) continue;
    const jobId = `${s.id}:${p}:${Date.now()}`;
    log(`${s.id}: posting on ${p}`);
    const done = waitForPost(jobId, p);
    sendPostJob({
      jobId, platform: p, shortId: s.id, videoFileId: video.id, thumbFileId: thumb?.id ?? "", token,
      title: field("Title"), description: field("Description"), tags: meta.tags,
      caption: copyFields(p === "youtube" ? "instagram" : p, meta)[0]?.text ?? "",
      stopBeforePublish: false,
    });
    const st = await done;
    if (st.state !== "done") {
      log(`${s.id}: ${p} failed: ${st.message}`);
      continue;
    }
    row = await recordPosted(row, p);
    log(`${s.id}: ${p} done`);
  }
  return row;
}
