import { randomUUID } from "node:crypto";

export const VISITOR_COOKIE = "bv_id";
export const SESSION_COOKIE = "bv_s";
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365;
const SESSION_MAX_AGE = 30 * 60;

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

function cookie(name: string, value: string, maxAge: number, secure: boolean): string {
  const base = `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
  return secure ? `${base}; Secure` : base;
}

export function trackingIdentity(req: Request, headers: Headers) {
  const cookieHeader = req.headers.get("cookie");
  const existingVisitor = readCookie(cookieHeader, VISITOR_COOKIE);
  const existingSession = readCookie(cookieHeader, SESSION_COOKIE);
  const visitorId = existingVisitor ?? randomUUID();
  const sessionId = existingSession ?? randomUUID();
  const secure = req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https://");

  headers.append("Set-Cookie", cookie(VISITOR_COOKIE, visitorId, VISITOR_MAX_AGE, secure));
  headers.append("Set-Cookie", cookie(SESSION_COOKIE, sessionId, SESSION_MAX_AGE, secure));

  return { visitorId, sessionId, isNewVisitor: !existingVisitor };
}
