import { db, siteEvents } from "@/lib/db";
import { getClientIp } from "@/lib/http/get-ip";
import { createRateLimiter } from "@/lib/rate-limit";
import { deviceFromUa, normalizeTrackedPath } from "@/lib/track/parse";
import { isSiteEventName } from "@/lib/track/event-types";
import { trackingIdentity } from "@/lib/track/identity";
import type { Language } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const eventRateLimiter = createRateLimiter({ max: 600, windowMs: 60 * 1000 });

function shortText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text.slice(0, max) : null;
}

function parseLocale(value: unknown): Language | null {
  if (value === "ru" || value === "uz") return value;
  if (typeof value !== "string") return null;
  const locale = value.toLowerCase();
  if (locale.startsWith("ru")) return "ru";
  if (locale.startsWith("uz")) return "uz";
  return null;
}

export async function POST(req: Request): Promise<Response> {
  const headers = new Headers();
  const identity = trackingIdentity(req, headers);
  const noContent = () => new Response(null, { status: 204, headers });

  const ip = getClientIp(req);
  if (!eventRateLimiter.check(ip)) return noContent();

  let body: Record<string, unknown>;
  try {
    body = JSON.parse((await req.text()) || "{}") as Record<string, unknown>;
  } catch {
    return noContent();
  }

  if (!isSiteEventName(body.event)) return noContent();
  const path = normalizeTrackedPath(shortText(body.path, 512));
  if (!path) return noContent();

  try {
    await db.insert(siteEvents).values({
      event: body.event,
      path,
      visitorId: identity.visitorId,
      sessionId: identity.sessionId,
      locale: parseLocale(body.loc),
      device: deviceFromUa(req.headers.get("user-agent")),
      placement: shortText(body.placement, 80),
      reason: shortText(body.reason, 120),
      source: shortText(body.source, 100),
      utmSource: shortText(body.utm_source, 100),
      utmMedium: shortText(body.utm_medium, 100),
      utmCampaign: shortText(body.utm_campaign, 100),
    });
  } catch (err) {
    console.error("site_event insert failed", err);
  }

  return noContent();
}
