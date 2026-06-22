import { describe, expect, it } from "vitest";
import { contentObjectCreateSchema, contentObjectPatchSchema } from "./content-object";

describe("contentObjectCreateSchema", () => {
  it("accepts the minimal V1 blog + Telegram draft shape", () => {
    const parsed = contentObjectCreateSchema.parse({
      brief: "Write a RU/UZ blog post about POS for a minimarket.",
      draft_text: "Blog draft",
      telegram_text: "Telegram draft",
    });

    expect(parsed.platforms).toEqual(["blog", "telegram"]);
    expect(parsed.source).toBe("api");
  });

  it("requires either draft_text or explicit drafts", () => {
    const parsed = contentObjectCreateSchema.safeParse({
      brief: "Only a brief is not enough",
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts legacy draft_text-only payloads", () => {
    const parsed = contentObjectCreateSchema.safeParse({
      brief: "Legacy blog-only payload using default platforms",
      draft_text: "Blog draft",
    });

    expect(parsed.success).toBe(true);
  });

  it("allows explicit blog-only objects", () => {
    const parsed = contentObjectCreateSchema.safeParse({
      brief: "Blog-only draft",
      platforms: ["blog"],
      draft_text: "Blog draft",
    });

    expect(parsed.success).toBe(true);
  });

  it("allows generating objects without drafts", () => {
    const parsed = contentObjectCreateSchema.parse({
      brief: "Generate this after the durable record exists.",
      status: "generating",
      platforms: ["blog", "telegram"],
      drafts: [],
    });

    expect(parsed.status).toBe("generating");
    expect(parsed.drafts).toEqual([]);
  });

  it("accepts draft format and metadata", () => {
    const parsed = contentObjectCreateSchema.parse({
      brief: "Structured package",
      platforms: ["telegram"],
      drafts: [
        {
          version: 2,
          platform: "telegram",
          text: "Telegram draft",
          format: "telegram_text",
          metadata: { locale: "uz" },
        },
      ],
    });

    expect(parsed.drafts?.[0]?.format).toBe("telegram_text");
    expect(parsed.drafts?.[0]?.metadata).toEqual({ locale: "uz" });
  });
});

describe("contentObjectPatchSchema", () => {
  it("accepts approval state updates", () => {
    const parsed = contentObjectPatchSchema.parse({
      status: "approved",
      approved_draft_version: 1,
    });

    expect(parsed.status).toBe("approved");
  });

  it("accepts expected status plus appended drafts", () => {
    const parsed = contentObjectPatchSchema.parse({
      expected_status: "generating",
      status: "pending_approval",
      append_drafts: [
        {
          version: 1,
          platform: "blog",
          text: "Rendered TypeScript",
          format: "blog_ts",
          metadata: { slug: "task-post" },
        },
      ],
    });

    expect(parsed.expected_status).toBe("generating");
    expect(parsed.append_drafts?.[0]?.metadata).toEqual({ slug: "task-post" });
  });

  it("rejects empty patches", () => {
    expect(contentObjectPatchSchema.safeParse({}).success).toBe(false);
  });

  it("does not treat expected_status alone as a mutation", () => {
    expect(contentObjectPatchSchema.safeParse({ expected_status: "generating" }).success).toBe(false);
  });
});
