import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Durable private copy of lead documents (patent / passport / shop photo).
 * Passport is sensitive PII — the bucket MUST be private (no public access).
 *
 * Fully optional: if the Supabase env vars are not set, every function here is a
 * no-op that returns null. The lead pipeline still works (files reach the
 * Telegram group); only the off-Telegram backup is skipped.
 */

export type LeadDocKind = "patent" | "passport" | "shop";

let cached: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, { auth: { persistSession: false } });
  }
  return cached;
}

function bucket(): string {
  return process.env.SUPABASE_LEAD_BUCKET ?? "lead-docs";
}

function extFor(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export function isStorageConfigured(): boolean {
  return getClient() !== null;
}

/** Upload one document. Returns the storage path, or null if unconfigured/failed. */
export async function uploadLeadDoc(leadId: number, kind: LeadDocKind, file: File): Promise<string | null> {
  const supabase = getClient();
  if (!supabase) return null;

  const path = `leads/${leadId}/${kind}.${extFor(file.type)}`;
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage.from(bucket()).upload(path, bytes, {
      contentType: file.type,
      upsert: true,
    });
    if (error) {
      console.error("Supabase upload failed", kind, error.message);
      return null;
    }
    return path;
  } catch (err) {
    console.error("Supabase upload error", kind, err);
    return null;
  }
}
