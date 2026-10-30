/**
 * Talks to the private Blockerflow Poster Chrome extension (blockerflow/marketing/blockerflow-poster), whose
 * bridge script runs on this page. Messages go through window.postMessage.
 */
import type { Platform } from "./shortsAdmin";

export interface PostJob {
  jobId: string;
  platform: Platform;
  shortId: string;
  videoFileId: string;
  thumbFileId: string;
  token: string;
  title: string;
  description: string;
  tags: string[];
  caption: string;
  stopBeforePublish: boolean;
}

export type PostState = "working" | "ready" | "done" | "error";

export interface PostStatus {
  jobId: string;
  platform: Platform;
  state: PostState;
  message: string;
  url?: string;
}

const fromPoster = (e: MessageEvent) => e.source === window && e.data && e.data.source === "blockerflow-poster";

/** The extension's version when it is installed, otherwise null (after `timeout` ms). */
export function detectPoster(timeout = 800): Promise<string | null> {
  return new Promise((resolve) => {
    const done = (v: string | null) => {
      window.removeEventListener("message", onMsg);
      clearTimeout(timer);
      resolve(v);
    };
    const onMsg = (e: MessageEvent) => {
      if (fromPoster(e) && e.data.type === "pong") done(String(e.data.version || "1"));
    };
    window.addEventListener("message", onMsg);
    const timer = setTimeout(() => done(null), timeout);
    window.postMessage({ source: "blockerflow-page", type: "ping" }, window.location.origin);
  });
}

export function sendPostJob(job: PostJob) {
  window.postMessage({ source: "blockerflow-page", type: "post", job }, window.location.origin);
}

export function cancelPostJob(jobId: string) {
  window.postMessage({ source: "blockerflow-page", type: "cancel", jobId }, window.location.origin);
}

/** Calls back with every progress message for the given job. Returns the unsubscribe function. */
export function onPostStatus(jobId: string, cb: (s: PostStatus) => void): () => void {
  const onMsg = (e: MessageEvent) => {
    if (fromPoster(e) && e.data.type === "status" && e.data.jobId === jobId) {
      cb({ jobId, platform: e.data.platform, state: e.data.state, message: e.data.message, url: e.data.url });
    }
  };
  window.addEventListener("message", onMsg);
  return () => window.removeEventListener("message", onMsg);
}
