import type { Lead } from "@/lib/db/schema";
import { formatLeadPhotoCaption } from "./format";

/**
 * Send web-uploaded lead documents to the Telegram group as ONE photo album,
 * uploading the raw bytes (multipart) rather than a Telegram file_id. The first
 * photo carries the lead info caption. Returns the Telegram file_ids in the same
 * order as `items` (null where one couldn't be resolved) so the caller can store
 * them on the lead, mirroring bot-sourced leads.
 */

export interface UploadedDoc {
  file: File;
  label: string;
}

interface TgPhotoSize {
  file_id: string;
  file_size?: number;
}

interface TgMessage {
  photo?: TgPhotoSize[];
}

function largestFileId(photo: TgPhotoSize[] | undefined): string | null {
  if (!photo || photo.length === 0) return null;
  const best = photo.reduce((a, b) => ((b.file_size ?? 0) >= (a.file_size ?? 0) ? b : a));
  return best.file_id;
}

export async function sendLeadDocsAlbum(
  token: string,
  chatId: string,
  lead: Lead,
  items: UploadedDoc[],
): Promise<(string | null)[]> {
  if (items.length === 0) return [];

  const info = formatLeadPhotoCaption(lead);

  const fd = new FormData();
  fd.append("chat_id", chatId);

  const media = items.map((it, i) => ({
    type: "photo" as const,
    media: `attach://f${i}`,
    caption: i === 0 ? `${info}\n\n${it.label}` : it.label,
    parse_mode: "HTML" as const,
  }));
  fd.append("media", JSON.stringify(media));
  items.forEach((it, i) => {
    fd.append(`f${i}`, it.file, it.file.name || `f${i}.jpg`);
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, {
      method: "POST",
      body: fd,
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Telegram sendMediaGroup (upload) failed", res.status, body);
      return items.map(() => null);
    }
    const json = (await res.json().catch(() => null)) as { result?: TgMessage[] } | null;
    const result = json?.result ?? [];
    return items.map((_, i) => largestFileId(result[i]?.photo));
  } catch (err) {
    console.error("Telegram sendMediaGroup (upload) error", err);
    return items.map(() => null);
  } finally {
    clearTimeout(timeout);
  }
}
