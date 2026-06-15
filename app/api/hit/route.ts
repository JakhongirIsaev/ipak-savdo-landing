import { db, pageViews } from "@/lib/db";
import { getClientIp } from "@/lib/http/get-ip";
import { createRateLimiter } from "@/lib/rate-limit";
import { deviceFromUa, referrerHost, normalizeTrackedPath } from "@/lib/track/parse";
import { trackingIdentity } from "@/lib/track/identity";
import type { Language } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Generous cap — just stops trivial flooding, NAT'd offices stay under it.
const hitRateLimiter = createRateLimiter({ max: 300, windowMs: 60 * 1000 });

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
  const headers = new Headers();
  const identity = trackingIdentity(req, headers);

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
      visitorId: identity.visitorId,
      sessionId: identity.sessionId,
      isNewVisitor: identity.isNewVisitor,
      locale: parseLocale(body.loc),
      device: deviceFromUa(req.headers.get("user-agent")),
      referrer: referrerHost(typeof body.ref === "string" ? body.ref : null, selfHost),
    });
  } catch (err) {
    console.error("page_view insert failed", err);
  }

  return noContent();
}
