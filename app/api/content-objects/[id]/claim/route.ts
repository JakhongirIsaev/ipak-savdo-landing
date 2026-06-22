import { and, eq, inArray } from "drizzle-orm";
import { requireInternalToken } from "@/lib/api/internal-auth";
import { toContentObjectResponse } from "@/lib/content-objects";
import { db, contentObjects, contentObjectStatuses, type ContentObjectStatus, type NewContentObject } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

const claimSchema = z
  .object({
    operation: z.enum(["publish", "regenerate"]),
    expected_status: z.enum(contentObjectStatuses).optional(),
    approved_draft_version: z.number().int().min(1).optional(),
    actor: z.string().trim().max(120).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.operation === "publish" && !data.approved_draft_version) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["approved_draft_version"],
        message: "approved_draft_version is required for publish claims",
      });
    }
  });

const claimRules: Record<
  "publish" | "regenerate",
  { from: ContentObjectStatus[]; to: ContentObjectStatus }
> = {
  publish: { from: ["pending_approval", "failed"], to: "publishing" },
  regenerate: { from: ["pending_approval", "rejected", "failed"], to: "generating" },
};

export async function POST(req: Request, ctx: RouteContext): Promise<Response> {
  const authError = requireInternalToken(req);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = claimSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const rule = claimRules[parsed.data.operation];
  const expected = parsed.data.expected_status;
  if (expected && !rule.from.includes(expected)) {
    return Response.json(
      { ok: false, error: "invalid_expected_status", expected_status: expected, operation: parsed.data.operation },
      { status: 400 },
    );
  }

  const allowedStatuses = expected ? [expected] : rule.from;
  const patch: Partial<NewContentObject> = {
    status: rule.to,
    updatedAt: new Date(),
  };
  if (parsed.data.operation === "publish") {
    patch.approvedDraftVersion = parsed.data.approved_draft_version ?? null;
  }

  const [updated] = await db
    .update(contentObjects)
    .set(patch)
    .where(and(eq(contentObjects.id, ctx.params.id), inArray(contentObjects.status, allowedStatuses)))
    .returning();

  if (updated) {
    return Response.json({ ok: true, content_object: toContentObjectResponse(updated) });
  }

  const rows = await db.select().from(contentObjects).where(eq(contentObjects.id, ctx.params.id)).limit(1);
  const current = rows[0];
  if (!current) return Response.json({ ok: false, error: "not_found" }, { status: 404 });

  return Response.json(
    { ok: false, error: "status_conflict", content_object: toContentObjectResponse(current) },
    { status: 409 },
  );
}
