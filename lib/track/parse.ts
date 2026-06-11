// Pure helpers for the first-party visitor beacon (/api/hit). Kept DB-free and
// side-effect-free so they can be unit-tested in isolation.

export type Device = "desktop" | "mobile" | "tablet";

export function deviceFromUa(ua: string | null | undefined): Device {
  if (!ua) return "desktop";
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|phone|blackberry|opera mini|iemobile/.test(s)) return "mobile";
  return "desktop";
}

// Returns the external referrer hostname (lowercased, no "www."), or null when
// the visit is direct or came from our own site.
export function referrerHost(ref: string | null | undefined, selfHost: string | null): string | null {
  if (!ref) return null;
  let host: string;
  try {
    host = new URL(ref).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (!host) return null;
  const cleanHost = host.replace(/^www\./, "");
  const cleanSelf = (selfHost ?? "").toLowerCase().replace(/^www\./, "");
  if (cleanSelf && cleanHost === cleanSelf) return null;
  return cleanHost;
}

// A path is trackable only if it's a real site page: rooted, not the admin
// cabinet, not an API/asset route. Query string is stripped before checks.
export function normalizeTrackedPath(rawPath: string | null | undefined): string | null {
  if (!rawPath || typeof rawPath !== "string") return null;
  let path = rawPath.split("?")[0].split("#")[0].trim();
  if (!path.startsWith("/")) return null;
  if (path.length > 1) path = path.replace(/\/+$/, "") || "/";
  if (path.length > 512) return null;
  if (path.startsWith("/admin") || path.startsWith("/api")) return null;
  if (path.startsWith("/_next") || path.startsWith("/static")) return null;
  // Asset-looking requests (file extension in the last segment).
  const last = path.split("/").pop() ?? "";
  if (/\.[a-z0-9]{2,5}$/i.test(last)) return null;
  return path;
}

// Friendly RU label for a referrer host shown in the admin.
export function referrerLabel(host: string | null): string {
  if (!host) return "Прямые заходы";
  const h = host.toLowerCase();
  if (h === "t.me" || h.endsWith("telegram.org") || h.endsWith("telegram.me")) return "Telegram";
  if (h.includes("instagram")) return "Instagram";
  if (h.includes("facebook") || h === "fb.com" || h === "l.facebook.com") return "Facebook";
  if (h.includes("google")) return "Google";
  if (h.includes("yandex")) return "Yandex";
  if (h.includes("youtube") || h === "youtu.be") return "YouTube";
  if (h.includes("tiktok")) return "TikTok";
  return host;
}
