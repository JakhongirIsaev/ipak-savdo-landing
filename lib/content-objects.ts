import type {
  ContentObject,
  ContentObjectDraft,
  ContentObjectMetrics,
  ContentObjectStatus,
} from "@/lib/db/schema";
import type { ContentObjectCreateInput } from "@/lib/validators/content-object";

export const contentObjectTransitions: Record<ContentObjectStatus, ContentObjectStatus[]> = {
  draft: ["generating", "pending_approval", "rejected"],
  generating: ["pending_approval", "failed", "rejected"],
  pending_approval: ["publishing", "generating", "rejected", "approved"],
  publishing: ["staged", "published", "failed"],
  staged: ["published", "rejected", "failed"],
  approved: ["publishing", "rejected", "published"],
  rejected: ["generating"],
  published: [],
  failed: ["generating", "publishing", "rejected"],
};

export function canTransitionContentObject(
  from: ContentObjectStatus,
  to: ContentObjectStatus,
): boolean {
  return from === to || contentObjectTransitions[from].includes(to);
}

function draftLocale(draft: ContentObjectDraft): string {
  const metadata = draft.metadata;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return "";
  const locale = metadata.locale;
  return typeof locale === "string" ? locale : "";
}

export function contentObjectDraftKey(draft: ContentObjectDraft): string {
  return [
    draft.platform,
    draft.version,
    draft.format ?? "",
    draftLocale(draft),
  ].join(":");
}

export function appendContentObjectDrafts(
  existing: ContentObjectDraft[],
  incoming: ContentObjectDraft[],
): { ok: true; drafts: ContentObjectDraft[] } | { ok: false; error: string; key: string } {
  const next = [...existing];
  const seen = new Map(existing.map((draft) => [contentObjectDraftKey(draft), draft]));

  for (const draft of incoming) {
    const key = contentObjectDraftKey(draft);
    const current = seen.get(key);
    if (!current) {
      next.push(draft);
      seen.set(key, draft);
      continue;
    }
    const currentComparable = { ...current, created_at: "" };
    const draftComparable = { ...draft, created_at: "" };
    if (JSON.stringify(current) !== JSON.stringify(draft)
      && JSON.stringify(currentComparable) !== JSON.stringify(draftComparable)) {
      return { ok: false, error: "duplicate_draft", key };
    }
  }

  return { ok: true, drafts: next };
}

export function buildInitialDrafts(input: ContentObjectCreateInput, nowIso: string): ContentObjectDraft[] {
  if (input.drafts?.length) {
    return input.drafts.map((draft) => ({
      ...draft,
      created_at: draft.created_at ?? nowIso,
      metadata: draft.metadata ?? {},
    }));
  }

  if (!input.draft_text && !input.telegram_text) {
    return [];
  }

  const drafts: ContentObjectDraft[] = [
    {
      version: 1,
      platform: "blog",
      text: input.draft_text ?? "",
      created_at: nowIso,
      format: "blog_ts",
      metadata: {},
    },
  ];

  if (input.telegram_text) {
    drafts.push({
      version: 1,
      platform: "telegram",
      text: input.telegram_text,
      created_at: nowIso,
      format: "telegram_text",
      metadata: { locale: "ru" },
    });
  }

  return drafts;
}

export function toContentObjectResponse(row: ContentObject) {
  return {
    id: row.id,
    campaign_id: row.campaignId,
    brief: row.brief,
    status: row.status,
    platforms: row.platforms,
    drafts: row.drafts,
    assets: row.assets,
    approved_draft_version: row.approvedDraftVersion,
    approved_asset_version: row.approvedAssetVersion,
    publish_jobs: row.publishJobs,
    metrics: row.metrics as ContentObjectMetrics,
    dead_letters: row.deadLetters,
    source: row.source,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}
