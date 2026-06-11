import { randomUUID } from "node:crypto";
import { db, pageViews } from "@/lib/db";
import { getClientIp } from "@/lib/http/get-ip";
import { createRateLimiter } from "@/lib/rate-limit";
import { deviceFromUa, referrerHost, normalizeTrackedPath } from "@/lib/track/parse";
import type { Language } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VISITOR_COOKIE = "bv_id";
const SESSION_COOKIE = "bv_s";
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const SESSION_MAX_AGE = 30 * 60; // 30 min, refreshed on every hit

// Generous cap — just stops trivial flooding, NAT'd offices stay under it.
const hitRateLimiter = createRateLimiter({ max: 300, windowMs: 60 * 1000 });

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

function parseLocale(v: unknown): Language | null {
  if (v === "ru" || v === "uz") return v;
  if (typeof v === "string") {
    const s = v.toLowerCase();
    if (s.startsWith("ru")) return "ru";
    if (s.startsWith("uz")) return "uz";
  }
  return null;
}

export async function POST(req: Request): Promise<Response> {
  const cookieHeader = req.headers.get("cookie");
  const existingVisitor = readCookie(cookieHeader, VISITOR_COOKIE);
  const existingSession = readCookie(cookieHeader, SESSION_COOKIE);

  const visitorId = existingVisitor ?? randomUUID();
  const sessionId = existingSession ?? randomUUID();
  const isNewVisitor = !existingVisitor;

  const secure =
    req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https://");

  const headers = new Headers();
  headers.append("Set-Cookie", cookie(VISITOR_COOKIE, visitorId, VISITOR_MAX_AGE, secure));
  headers.append("Set-Cookie", cookie(SESSION_COOKIE, sessionId, SESSION_MAX_AGE, secure));

  const noContent = () => new Response(null, { status: 204, headers });

  let body: { path?: unknown; loc?: unknown; ref?: unknown };
  try {
    body = JSON.parse((await req.text()) || "{}");
  } catch {
    return noContent();
  }

  const path = normalizeTrackedPath(typeof body.path === "string" ? body.path : null);
  if (!path) return noContent();

  const ip = getClientIp(req);
  if (!hitRateLimiter.check(ip)) return noContent();

  const selfHost = (() => {
    try {
      return new URL(req.url).hostname;
    } catch {
      return req.headers.get("host");
    }
  })();

  try {
    await db.insert(pageViews).values({
      path,
      visitorId,
      sessionId,
      isNewVisitor,
      locale: parseLocale(body.loc),
      device: deviceFromUa(req.headers.get("user-agent")),
      referrer: referrerHost(typeof body.ref === "string" ? body.ref : null, selfHost),
    });
  } catch (err) {
    console.error("page_view insert failed", err);
  }

  return noContent();
}
