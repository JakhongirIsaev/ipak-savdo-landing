export const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_DOC_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type LeadFileError = "missing" | "type" | "size";

/** Validate a single uploaded lead document. `value` is whatever FormData.get returned. */
export function validateLeadFile(value: FormDataEntryValue | null): { ok: true; file: File } | { ok: false; reason: LeadFileError } {
  if (!(value instanceof File) || value.size === 0) {
    return { ok: false, reason: "missing" };
  }
  if (!(ALLOWED_DOC_TYPES as readonly string[]).includes(value.type)) {
    return { ok: false, reason: "type" };
  }
  if (value.size > MAX_DOC_BYTES) {
    return { ok: false, reason: "size" };
  }
  return { ok: true, file: value };
}

/**
 * Confirm the file really is a JPEG/PNG/WEBP by its leading bytes, not just by
 * its (browser-supplied, spoofable) Content-Type. Defends against an attacker
 * uploading an executable with `type: "image/jpeg"`.
 */
export async function sniffImageType(file: File): Promise<boolean> {
  const h = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff;
  const png = h[0] === 0x89 && h[1] === 0x50 && h[2] === 0x4e && h[3] === 0x47;
  const webp =
    h[0] === 0x52 && h[1] === 0x49 && h[2] === 0x46 && h[3] === 0x46 && // "RIFF"
    h[8] === 0x57 && h[9] === 0x45 && h[10] === 0x42 && h[11] === 0x50; // "WEBP"
  return jpeg || png || webp;
}
