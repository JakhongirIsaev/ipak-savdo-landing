import { z } from "zod";
import { contentObjectStatuses, contentPlatforms } from "@/lib/db/schema";

const platformSchema = z.enum(contentPlatforms);

export const contentObjectDraftSchema = z.object({
  version: z.number().int().min(1),
  platform: platformSchema,
  text: z.string().trim().min(1).max(60000),
  created_at: z.string().datetime().optional(),
  format: z.string().trim().min(1).max(80).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const contentObjectCreateSchema = z
  .object({
    id: z.string().uuid().optional(),
    campaign_id: z.string().trim().max(120).optional().nullable(),
    brief: z.string().trim().min(3).max(4000),
    status: z.enum(contentObjectStatuses).default("pending_approval"),
    platforms: z.array(platformSchema).min(1).max(6).default(["blog", "telegram"]),
    draft_text: z.string().trim().min(1).max(60000).optional(),
    telegram_text: z.string().trim().min(1).max(10000).optional(),
    drafts: z.array(contentObjectDraftSchema).max(20).optional(),
    source: z.string().trim().min(1).max(80).default("api"),
  })
  .superRefine((data, ctx) => {
    if (data.status === "generating" && !data.drafts?.length && !data.draft_text) {
      return;
    }

    if (!data.draft_text && !data.drafts?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["draft_text"],
        message: "draft_text or drafts is required",
      });
    }

    if (data.drafts?.length) {
      for (const platform of data.platforms) {
        if (!data.drafts.some((draft) => draft.platform === platform)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["drafts"],
            message: `draft for platform '${platform}' is required`,
          });
        }
      }
      return;
    }

    if (data.platforms.includes("blog") && !data.draft_text) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["draft_text"],
        message: "draft_text is required for blog platform",
      });
    }

  });

export const contentObjectPatchSchema = z
  .object({
    expected_status: z.enum(contentObjectStatuses).optional(),
    status: z.enum(contentObjectStatuses).optional(),
    approved_draft_version: z.number().int().min(1).nullable().optional(),
    approved_asset_version: z.number().int().min(1).nullable().optional(),
    append_drafts: z.array(contentObjectDraftSchema).min(1).max(20).optional(),
    publish_job: z
      .object({
        platform: platformSchema,
        status: z.string().trim().min(1).max(80),
        job_id: z.string().trim().max(160).optional(),
        published_at: z.string().datetime().optional(),
        url: z.string().url().optional(),
        error: z.string().trim().max(2000).optional(),
      })
      .optional(),
    metric_patch: z
      .object({
        saves: z.number().int().min(0).optional(),
        shares: z.number().int().min(0).optional(),
        comments: z.number().int().min(0).optional(),
        gsc_clicks: z.number().int().min(0).optional(),
        gsc_impressions: z.number().int().min(0).optional(),
        leads: z.number().int().min(0).optional(),
      })
      .optional(),
    dead_letter: z
      .object({
        error: z.string().trim().min(1).max(2000),
        context: z.unknown().optional(),
        retry_count: z.number().int().min(0).max(20).default(0),
      })
      .optional(),
  })
  .refine((data) => {
    const { expected_status: _expectedStatus, ...mutations } = data;
    return Object.values(mutations).some((v) => v !== undefined);
  }, {
    message: "at least one patch field is required",
  });

export type ContentObjectCreateInput = z.infer<typeof contentObjectCreateSchema>;
export type ContentObjectPatchInput = z.infer<typeof contentObjectPatchSchema>;
