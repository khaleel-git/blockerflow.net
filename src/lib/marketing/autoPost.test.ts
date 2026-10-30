import { describe, expect, it } from "vitest";
import { berlinTime, dueShorts } from "./autoPost";
import { STATUS, type ShortRow } from "./shortsAdmin";

const row = (o: Partial<ShortRow>): ShortRow => ({
  row: 2, id: "x", theme: "t", title: "T", hook: "", length: "30", publish: "2026-11-11 12:00", review: "Approved", notes: "",
  posted: { youtube: "", instagram: "", tiktok: "" }, folderId: "f", videoId: "v", added: "2026-10-30", status: STATUS.inDrive, ...o,
});

describe("berlinTime", () => {
  it("reads winter time (UTC+1)", () => {
    expect(berlinTime("2026-11-11 12:00")?.toISOString()).toBe("2026-11-11T11:00:00.000Z");
  });
  it("reads summer time (UTC+2)", () => {
    expect(berlinTime("2026-07-01 12:00")?.toISOString()).toBe("2026-07-01T10:00:00.000Z");
  });
  it("accepts a date without a time and rejects junk", () => {
    expect(berlinTime("2026-12-27")?.toISOString()).toBe("2026-12-26T23:00:00.000Z");
    expect(berlinTime("")).toBeNull();
    expect(berlinTime("soon")).toBeNull();
  });
});

describe("dueShorts", () => {
  const now = new Date("2026-11-11T11:05:00Z"); // 12:05 in Berlin
  it("takes approved shorts in Drive whose time has passed, oldest first", () => {
    const rows = [
      row({ id: "later", publish: "2026-11-11 18:00" }),
      row({ id: "b", publish: "2026-11-11 12:00" }),
      row({ id: "a", publish: "2026-11-09 12:00" }),
    ];
    expect(dueShorts(rows, now).map((s) => s.id)).toEqual(["a", "b"]);
  });
  it("skips shorts that are not approved, not in Drive, fully posted or without a time", () => {
    const rows = [
      row({ id: "pending", review: "Pending" }),
      row({ id: "rejected", review: "Rejected" }),
      row({ id: "gone", status: STATUS.posted }),
      row({ id: "done", posted: { youtube: "x", instagram: "x", tiktok: "x" } }),
      row({ id: "notime", publish: "" }),
      row({ id: "half", posted: { youtube: "2026-11-11", instagram: "", tiktok: "" } }),
    ];
    expect(dueShorts(rows, now).map((s) => s.id)).toEqual(["half"]);
  });
  it("posts at most `max` per run", () => {
    const rows = ["a", "b", "c", "d"].map((id, i) => row({ id, publish: `2026-11-0${i + 1} 12:00` }));
    expect(dueShorts(rows, now, 3).map((s) => s.id)).toEqual(["a", "b", "c"]);
  });
});

describe("YouTube-only (long-form) rows", () => {
  const longform = row({ posted: { youtube: "", instagram: "n/a", tiktok: "n/a" } });
  it("are due until YouTube is posted", () => {
    expect(dueShorts([longform], new Date("2026-11-12T00:00:00Z")).map((s) => s.id)).toEqual(["x"]);
  });
  it("count as fully posted once YouTube is done", () => {
    const done = { ...longform, posted: { ...longform.posted, youtube: "2026-11-12" } };
    expect(dueShorts([done], new Date("2026-11-12T00:00:00Z"))).toEqual([]);
  });
});
