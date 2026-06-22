import { and, eq } from "drizzle-orm";
import { requireInternalToken } from "@/lib/api/internal-auth";
import {
  appendContentObjectDrafts,
  canTransitionContentObject,
  toContentObjectResponse,
} from "@/lib/content-objects";
import { db, contentObjects, type ContentObjectDeadLetter, type ContentObjectDraft, type NewContentObject } from "@/lib/db";
import { contentObjectPatchSchema } from "@/lib/validators/content-object";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function GET(req: Request, ctx: RouteContext): Promise<Response> {
  const authError = requireInternalToken(req);
  if (authError) return authError;

  const rows = await db.select().from(contentObjects).where(eq(contentObjects.id, ctx.params.id)).limit(1);
  const row = rows[0];
  if (!row) return Response.json({ ok: false, error: "not_found" }, { status: 404 });

  return Response.json({ ok: true, content_object: toContentObjectResponse(row) });
}

export async function PATCH(req: Request, ctx: RouteContext): Promise<Response> {
  const authError = requireInternalToken(req);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = contentObjectPatchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const rows = await db.select().from(contentObjects).where(eq(contentObjects.id, ctx.params.id)).limit(1);
  const current = rows[0];
  if (!current) return Response.json({ ok: false, error: "not_found" }, { status: 404 });

  if (parsed.data.expected_status && current.status !== parsed.data.expected_status) {
    return Response.json(
      { ok: false, error: "status_conflict", content_object: toContentObjectResponse(current) },
      { status: 409 },
    );
  }

  if (parsed.data.status && !canTransitionContentObject(current.status, parsed.data.status)) {
    return Response.json(
      {
        ok: false,
        error: "invalid_status_transition",
        from: current.status,
        to: parsed.data.status,
        content_object: toContentObjectResponse(current),
      },
      { status: 409 },
    );
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const patch: Partial<NewContentObject> = {
    updatedAt: now,
  };

  if (parsed.data.status !== undefined) patch.status = parsed.data.status;
  if (parsed.data.approved_draft_version !== undefined) {
    patch.approvedDraftVersion = parsed.data.approved_draft_version;
  }
  if (parsed.data.approved_asset_version !== undefined) {
    patch.approvedAssetVersion = parsed.data.approved_asset_version;
  }
  if (parsed.data.append_drafts) {
    const incoming: ContentObjectDraft[] = parsed.data.append_drafts.map((draft) => ({
      ...draft,
      created_at: draft.created_at ?? nowIso,
      metadata: draft.metadata ?? {},
    }));
    const appended = appendContentObjectDrafts(current.drafts, incoming);
    if (!appended.ok) {
      return Response.json(
        { ok: false, error: appended.error, key: appended.key, content_object: toContentObjectResponse(current) },
        { status: 409 },
      );
    }
    patch.drafts = appended.drafts;
  }
  if (parsed.data.publish_job) {
    patch.publishJobs = [...current.publishJobs, parsed.data.publish_job];
  }
  if (parsed.data.metric_patch) {
    patch.metrics = { ...current.metrics, ...parsed.data.metric_patch };
  }
  if (parsed.data.dead_letter) {
    const deadLetter: ContentObjectDeadLetter = {
      timestamp: new Date().toISOString(),
      error: parsed.data.dead_letter.error,
      context: parsed.data.dead_letter.context,
      retry_count: parsed.data.dead_letter.retry_count,
    };
    patch.deadLetters = [...current.deadLetters, deadLetter];
  }

  const [updated] = await db
    .update(contentObjects)
    .set(patch)
    .where(
      parsed.data.expected_status
        ? and(eq(contentObjects.id, ctx.params.id), eq(contentObjects.status, parsed.data.expected_status))
        : eq(contentObjects.id, ctx.params.id),
    )
    .returning();

  if (!updated) {
    const fresh = await db.select().from(contentObjects).where(eq(contentObjects.id, ctx.params.id)).limit(1);
    const row = fresh[0];
    if (!row) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    return Response.json(
      { ok: false, error: "status_conflict", content_object: toContentObjectResponse(row) },
      { status: 409 },
    );
  }

  return Response.json({ ok: true, content_object: toContentObjectResponse(updated) });
}
