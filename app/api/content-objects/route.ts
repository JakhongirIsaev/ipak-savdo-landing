import { desc, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { requireInternalToken } from "@/lib/api/internal-auth";
import { buildInitialDrafts, toContentObjectResponse } from "@/lib/content-objects";
import { db, contentObjects, contentObjectStatuses } from "@/lib/db";
import { contentObjectCreateSchema } from "@/lib/validators/content-object";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseLimit(value: string | null): number {
  const n = Number(value ?? "20");
  if (!Number.isFinite(n)) return 20;
  return Math.max(1, Math.min(100, Math.floor(n)));
}

function isContentObjectStatus(value: string): value is (typeof contentObjectStatuses)[number] {
  return contentObjectStatuses.includes(value as (typeof contentObjectStatuses)[number]);
}

export async function GET(req: Request): Promise<Response> {
  const authError = requireInternalToken(req);
  if (authError) return authError;

  const url = new URL(req.url);
  const limit = parseLimit(url.searchParams.get("limit"));
  const statusParam = url.searchParams.get("status");
  let statuses: (typeof contentObjectStatuses)[number][] = [];

  if (statusParam) {
    statuses = statusParam.split(",").map((s) => s.trim()).filter(Boolean) as (typeof contentObjectStatuses)[number][];
    if (!statuses.length || statuses.some((status) => !isContentObjectStatus(status))) {
      return Response.json({ ok: false, error: "invalid_status" }, { status: 400 });
    }
  }

  const rows = statuses.length
    ? await db
        .select()
        .from(contentObjects)
        .where(statuses.length === 1 ? eq(contentObjects.status, statuses[0]) : inArray(contentObjects.status, statuses))
        .orderBy(desc(contentObjects.createdAt))
        .limit(limit)
    : await db.select().from(contentObjects).orderBy(desc(contentObjects.createdAt)).limit(limit);

  return Response.json({ ok: true, content_objects: rows.map(toContentObjectResponse) });
}

export async function POST(req: Request): Promise<Response> {
  const authError = requireInternalToken(req);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = contentObjectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const values = {
    id: parsed.data.id ?? randomUUID(),
    campaignId: parsed.data.campaign_id ?? null,
    brief: parsed.data.brief,
    status: parsed.data.status,
    platforms: parsed.data.platforms,
    drafts: buildInitialDrafts(parsed.data, nowIso),
    assets: [],
    approvedDraftVersion: null,
    approvedAssetVersion: null,
    publishJobs: [],
    metrics: {},
    deadLetters: [],
    source: parsed.data.source,
    webhookEventKey: parsed.data.idempotency_key ?? null,
    createdAt: now,
    updatedAt: now,
  };

  if (parsed.data.idempotency_key) {
    const [inserted] = await db
      .insert(contentObjects)
      .values(values)
      .onConflictDoNothing({ target: contentObjects.webhookEventKey })
      .returning();

    if (inserted) {
      return Response.json({ ok: true, duplicate: false, content_object: toContentObjectResponse(inserted) }, { status: 201 });
    }

    const [existing] = await db
      .select()
      .from(contentObjects)
      .where(eq(contentObjects.webhookEventKey, parsed.data.idempotency_key))
      .limit(1);

    if (existing) {
      return Response.json({ ok: true, duplicate: true, content_object: toContentObjectResponse(existing) });
    }

    return Response.json({ ok: false, error: "idempotency_conflict_missing" }, { status: 409 });
  }

  const [inserted] = await db.insert(contentObjects).values(values).returning();

  return Response.json({ ok: true, duplicate: false, content_object: toContentObjectResponse(inserted) }, { status: 201 });
}
