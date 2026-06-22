import { describe, expect, it } from "vitest";
import {
  appendContentObjectDrafts,
  buildInitialDrafts,
  canTransitionContentObject,
} from "./content-objects";

describe("buildInitialDrafts", () => {
  it("returns an empty draft list for generating creates", () => {
    const drafts = buildInitialDrafts(
      {
        brief: "Generate later",
        status: "generating",
        platforms: ["blog", "telegram"],
        source: "test",
        drafts: [],
      },
      "2026-06-22T18:00:00.000Z",
    );

    expect(drafts).toEqual([]);
  });
});

describe("appendContentObjectDrafts", () => {
  it("appends new drafts and treats exact duplicates as idempotent", () => {
    const draft = {
      version: 1,
      platform: "telegram" as const,
      text: "RU draft",
      created_at: "2026-06-22T18:00:00.000Z",
      format: "telegram_text",
      metadata: { locale: "ru" },
    };

    const first = appendContentObjectDrafts([], [draft]);
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = appendContentObjectDrafts(first.drafts, [draft]);
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.drafts).toHaveLength(1);
  });

  it("treats matching duplicate drafts with different timestamps as idempotent", () => {
    const existing = {
      version: 1,
      platform: "blog" as const,
      text: "Same draft",
      created_at: "2026-06-22T18:00:00.000Z",
      format: "blog_ts",
      metadata: { locale: "multi", slug: "same-draft" },
    };
    const retry = { ...existing, created_at: "2026-06-22T18:01:00.000Z" };

    const appended = appendContentObjectDrafts([existing], [retry]);

    expect(appended.ok).toBe(true);
    if (!appended.ok) return;
    expect(appended.drafts).toHaveLength(1);
  });

  it("rejects conflicting duplicate draft keys", () => {
    const existing = {
      version: 1,
      platform: "telegram" as const,
      text: "RU draft",
      created_at: "2026-06-22T18:00:00.000Z",
      format: "telegram_text",
      metadata: { locale: "ru" },
    };
    const conflict = { ...existing, text: "Changed draft" };

    const appended = appendContentObjectDrafts([existing], [conflict]);

    expect(appended.ok).toBe(false);
    if (appended.ok) return;
    expect(appended.error).toBe("duplicate_draft");
  });
});

describe("canTransitionContentObject", () => {
  it("allows the generation and approval lifecycle", () => {
    expect(canTransitionContentObject("generating", "pending_approval")).toBe(true);
    expect(canTransitionContentObject("pending_approval", "publishing")).toBe(true);
    expect(canTransitionContentObject("publishing", "staged")).toBe(true);
  });

  it("blocks direct publish claims before the publishing state", () => {
    expect(canTransitionContentObject("pending_approval", "published")).toBe(false);
  });
});
