import { describe, it, expect } from "vitest";
import { STATUS_META, statusMeta } from "./status-meta";
import { leadStatuses } from "@/lib/db/schema";

describe("STATUS_META", () => {
  it("has metadata for every status in the enum", () => {
    for (const status of leadStatuses) {
      expect(STATUS_META[status]).toBeDefined();
      expect(STATUS_META[status].emoji).toBeTruthy();
      expect(STATUS_META[status].label).toBeTruthy();
      expect(STATUS_META[status].dotClass).toMatch(/^bg-/);
    }
  });

  it("statusMeta helper returns metadata for a known status", () => {
    expect(statusMeta("won").emoji).toBe("🏆");
  });

  it("statusMeta on an unknown string returns a fallback", () => {
    expect(statusMeta("garbage" as never).emoji).toBe("•");
  });

  it("uses brand-aligned colors — only 'won' is green", () => {
    expect(STATUS_META.won.dotClass).toContain("green");
    expect(STATUS_META.new.dotClass).not.toContain("green");
    expect(STATUS_META.contacted.dotClass).not.toContain("green");
    expect(STATUS_META.demo.dotClass).not.toContain("green");
    expect(STATUS_META.lost.dotClass).not.toContain("green");
  });
});
