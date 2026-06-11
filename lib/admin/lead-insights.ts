import { sql } from "drizzle-orm";
import type { LeadStatus } from "@/lib/db/schema";

// Decision-grade lead analytics on top of data we already collect but never
// surfaced: first-party page_views, lead_events history, lead segments (type /
// language / equipment / city / utm), plus unit economics derived from the
// public pricing (49 000 so'm/mo for 6 pilot months, then 149 000 so'm/mo).

// Lazy DB import so pure helpers are unit-testable without DATABASE_URL.
function getDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { db } = require("@/lib/db") as typeof import("@/lib/db");
  return { db };
}

function unwrap<T>(res: unknown): T[] {
  const r = res as { rows?: T[] };
  return (r.rows ?? (res as T[])) as T[];
}

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// ─── First-party visits (page_views, no Google dependency) ──────────────────

export interface VisitStats {
  views30: number;
  visitors30: number;
  visitors7: number;
  newVisitors30: number;
  devices: { label: string; visitors: number }[];
  locales: { label: string; visitors: number }[];
  referrers: { label: string; visitors: number }[];
}

export async function getVisitStats(): Promise<VisitStats | null> {
  const { db } = getDb();
  try {
    const totals = unwrap<{ views30: number; visitors30: number; visitors7: number; new30: number }>(
      await db.execute(sql`
        SELECT
          count(*) FILTER (WHERE created_at >= now() - interval '30 days')::int AS views30,
          count(DISTINCT visitor_id) FILTER (WHERE created_at >= now() - interval '30 days')::int AS visitors30,
          count(DISTINCT visitor_id) FILTER (WHERE created_at >= now() - interval '7 days')::int AS visitors7,
          count(DISTINCT visitor_id) FILTER (WHERE is_new_visitor AND created_at >= now() - interval '30 days')::int AS new30
        FROM page_views
        WHERE path NOT LIKE '/admin%'
      `),
    )[0];

    const devices = unwrap<{ device: string | null; visitors: number }>(
      await db.execute(sql`
        SELECT COALESCE(NULLIF(device, ''), 'other') AS device,
               count(DISTINCT visitor_id)::int AS visitors
        FROM page_views
        WHERE created_at >= now() - interval '30 days' AND path NOT LIKE '/admin%'
        GROUP BY 1 ORDER BY visitors DESC
      `),
    );

    const locales = unwrap<{ locale: string | null; visitors: number }>(
      await db.execute(sql`
        SELECT COALESCE(NULLIF(locale, ''), '—') AS locale,
               count(DISTINCT visitor_id)::int AS visitors
        FROM page_views
        WHERE created_at >= now() - interval '30 days' AND path NOT LIKE '/admin%'
        GROUP BY 1 ORDER BY visitors DESC
      `),
    );

    const referrers = unwrap<{ host: string | null; visitors: number }>(
      await db.execute(sql`
        SELECT regexp_replace(referrer, '^https?://([^/]+).*$', '\\1') AS host,
               count(DISTINCT visitor_id)::int AS visitors
        FROM page_views
        WHERE created_at >= now() - interval '30 days'
          AND path NOT LIKE '/admin%'
          AND referrer IS NOT NULL AND referrer <> ''
          AND referrer NOT LIKE '%birliy.uz%'
        GROUP BY 1 ORDER BY visitors DESC LIMIT 6
      `),
    );

    const deviceLabel = (d: string): string =>
      d === "mobile" ? "Телефон" : d === "desktop" ? "Компьютер" : d === "tablet" ? "Планшет" : "Другое";
    const localeLabel = (l: string): string => (l === "ru" ? "Русский" : l === "uz" ? "Oʻzbek" : l);

    return {
      views30: num(totals?.views30),
      visitors30: num(totals?.visitors30),
      visitors7: num(totals?.visitors7),
      newVisitors30: num(totals?.new30),
      devices: devices.map((d) => ({ label: deviceLabel(String(d.device)), visitors: num(d.visitors) })),
      locales: locales.map((l) => ({ label: localeLabel(String(l.locale)), visitors: num(l.visitors) })),
      referrers: referrers.map((r) => ({ label: String(r.host ?? "—"), visitors: num(r.visitors) })),
    };
  } catch {
    return null;
  }
}

// ─── Stage-to-stage funnel (lead_events history) ─────────────────────────────

export interface StageConversion {
  total: number;
  reachedContacted: number;
  reachedDemo: number;
  reachedWon: number;
  lost: number;
  // median seconds between first entry into adjacent stages (null = no data yet)
  medianNewToContactedSec: number | null;
  medianContactedToDemoSec: number | null;
  medianDemoToWonSec: number | null;
  lostByStage: { stage: LeadStatus | "new"; count: number }[];
}

export async function getStageConversion(): Promise<StageConversion | null> {
  const { db } = getDb();
  try {
    const reached = unwrap<{ total: number; c: number; d: number; w: number; l: number }>(
      await db.execute(sql`
        WITH ranked AS (
          SELECT l.id, l.status,
            GREATEST(
              CASE l.status WHEN 'contacted' THEN 1 WHEN 'demo' THEN 2 WHEN 'won' THEN 3 ELSE 0 END,
              COALESCE((
                SELECT MAX(CASE e.to_status WHEN 'contacted' THEN 1 WHEN 'demo' THEN 2 WHEN 'won' THEN 3 ELSE 0 END)
                FROM lead_events e WHERE e.lead_id = l.id
              ), 0)
            ) AS max_rank
          FROM leads l
        )
        SELECT
          count(*)::int AS total,
          count(*) FILTER (WHERE max_rank >= 1)::int AS c,
          count(*) FILTER (WHERE max_rank >= 2)::int AS d,
          count(*) FILTER (WHERE max_rank >= 3)::int AS w,
          count(*) FILTER (WHERE status = 'lost')::int AS l
        FROM ranked
      `),
    )[0];

    const medians = unwrap<{ m1: string | null; m2: string | null; m3: string | null }>(
      await db.execute(sql`
        WITH firsts AS (
          SELECT lead_id,
            MIN(created_at) FILTER (WHERE to_status = 'new') AS t_new,
            MIN(created_at) FILTER (WHERE to_status = 'contacted') AS t_contacted,
            MIN(created_at) FILTER (WHERE to_status = 'demo') AS t_demo,
            MIN(created_at) FILTER (WHERE to_status = 'won') AS t_won
          FROM lead_events GROUP BY lead_id
        )
        SELECT
          percentile_cont(0.5) WITHIN GROUP (ORDER BY EXTRACT(epoch FROM (t_contacted - t_new)))
            FILTER (WHERE t_new IS NOT NULL AND t_contacted IS NOT NULL) AS m1,
          percentile_cont(0.5) WITHIN GROUP (ORDER BY EXTRACT(epoch FROM (t_demo - t_contacted)))
            FILTER (WHERE t_contacted IS NOT NULL AND t_demo IS NOT NULL) AS m2,
          percentile_cont(0.5) WITHIN GROUP (ORDER BY EXTRACT(epoch FROM (t_won - t_demo)))
            FILTER (WHERE t_demo IS NOT NULL AND t_won IS NOT NULL) AS m3
        FROM firsts
      `),
    )[0];

    const lostBy = unwrap<{ from_status: string | null; count: number }>(
      await db.execute(sql`
        SELECT COALESCE(e.from_status, 'new') AS from_status, count(DISTINCT e.lead_id)::int AS count
        FROM lead_events e
        WHERE e.to_status = 'lost'
        GROUP BY 1 ORDER BY count DESC
      `),
    );

    const toSec = (v: string | null | undefined): number | null =>
      v === null || v === undefined ? null : Math.round(Number(v));

    return {
      total: num(reached?.total),
      reachedContacted: num(reached?.c),
      reachedDemo: num(reached?.d),
      reachedWon: num(reached?.w),
      lost: num(reached?.l),
      medianNewToContactedSec: toSec(medians?.m1),
      medianContactedToDemoSec: toSec(medians?.m2),
      medianDemoToWonSec: toSec(medians?.m3),
      lostByStage: lostBy.map((r) => ({ stage: (r.from_status ?? "new") as LeadStatus | "new", count: num(r.count) })),
    };
  } catch {
    return null;
  }
}

// ─── Segments: who actually applies ──────────────────────────────────────────

export interface LeadSegments {
  byType: { type: string; total: number; won: number }[];
  byLanguage: { language: string; total: number }[];
  byCity: { city: string; total: number }[];
  equipmentYes: number;
  equipmentTotal: number;
  utm: { source: string; campaign: string; total: number; won: number }[];
}

export async function getLeadSegments(): Promise<LeadSegments | null> {
  const { db } = getDb();
  try {
    const byType = unwrap<{ business_type: string; total: number; won: number }>(
      await db.execute(sql`
        SELECT business_type, count(*)::int AS total,
               count(*) FILTER (WHERE status = 'won')::int AS won
        FROM leads GROUP BY 1 ORDER BY total DESC
      `),
    );
    const byLanguage = unwrap<{ language: string; total: number }>(
      await db.execute(sql`SELECT language, count(*)::int AS total FROM leads GROUP BY 1 ORDER BY total DESC`),
    );
    const byCity = unwrap<{ city: string; total: number }>(
      await db.execute(sql`
        SELECT city, count(*)::int AS total FROM leads
        WHERE city IS NOT NULL AND city <> ''
        GROUP BY 1 ORDER BY total DESC LIMIT 6
      `),
    );
    const equipment = unwrap<{ yes: number; total: number }>(
      await db.execute(sql`
        SELECT count(*) FILTER (WHERE needs_equipment)::int AS yes, count(*)::int AS total FROM leads
      `),
    )[0];
    const utm = unwrap<{ src: string; campaign: string; total: number; won: number }>(
      await db.execute(sql`
        SELECT
          COALESCE(NULLIF(utm_source, ''), source) AS src,
          COALESCE(NULLIF(utm_campaign, ''), '—') AS campaign,
          count(*)::int AS total,
          count(*) FILTER (WHERE status = 'won')::int AS won
        FROM leads
        GROUP BY 1, 2 ORDER BY total DESC LIMIT 8
      `),
    );

    return {
      byType: byType.map((r) => ({ type: r.business_type, total: num(r.total), won: num(r.won) })),
      byLanguage: byLanguage.map((r) => ({ language: r.language, total: num(r.total) })),
      byCity: byCity.map((r) => ({ city: r.city, total: num(r.total) })),
      equipmentYes: num(equipment?.yes),
      equipmentTotal: num(equipment?.total),
      utm: utm.map((r) => ({ source: r.src, campaign: r.campaign, total: num(r.total), won: num(r.won) })),
    };
  } catch {
    return null;
  }
}

// ─── Stale leads: where money is leaking right now ───────────────────────────

export interface StaleLead {
  id: number;
  ownerName: string;
  businessName: string;
  status: LeadStatus;
  hoursStuck: number;
}

// "new" untouched for 24h, or "contacted"/"demo" with no movement for 7 days.
export async function getStaleLeads(limit = 8): Promise<StaleLead[]> {
  const { db } = getDb();
  try {
    const rows = unwrap<{ id: number; owner_name: string; business_name: string; status: LeadStatus; hours: number }>(
      await db.execute(sql`
        SELECT id, owner_name, business_name, status,
               FLOOR(EXTRACT(epoch FROM (now() - COALESCE(last_status_change_at, created_at))) / 3600)::int AS hours
        FROM leads
        WHERE (status = 'new' AND created_at < now() - interval '24 hours')
           OR (status IN ('contacted', 'demo')
               AND COALESCE(last_status_change_at, created_at) < now() - interval '7 days')
        ORDER BY CASE status WHEN 'new' THEN 0 ELSE 1 END, hours DESC
        LIMIT ${limit}
      `),
    );
    return rows.map((r) => ({
      id: num(r.id),
      ownerName: r.owner_name,
      businessName: r.business_name,
      status: r.status,
      hoursStuck: num(r.hours),
    }));
  } catch {
    return [];
  }
}

// ─── Unit economics (pure, tested) ───────────────────────────────────────────

// Public pricing from the landing: 49 000 so'm/mo for the first 6 months,
// then 149 000 so'm/mo. Lifetime here = first 12 months (conservative).
export const PILOT_PRICE = 49_000;
export const FULL_PRICE = 149_000;
export const PILOT_MONTHS = 6;
export const REVENUE_6M = PILOT_PRICE * PILOT_MONTHS; // 294 000
export const REVENUE_12M = REVENUE_6M + FULL_PRICE * 6; // 1 188 000

export interface UnitEconomicsInput {
  visitors30: number; // first-party unique visitors, 30 days
  leads30: number; // leads created, 30 days
  totalLeads: number; // all time
  wonLeads: number; // all time
  pipelineActive: number; // current new + contacted + demo
}

export interface UnitEconomics {
  leadRatePct: number | null; // visitor -> lead, %
  winRatePct: number | null; // lead -> client, % (null until first won)
  visitorToClientPct: number | null;
  valuePerLead12m: number | null; // so'm
  valuePerVisitor12m: number | null; // so'm
  maxCacPayback6m: number | null; // max spend per lead to break even in 6 months, so'm
  pipelineValue12m: number | null; // so'm
  mrrPilot: number; // won x pilot price
  mrrAfterPilot: number; // won x full price
}

const round1 = (n: number): number => Math.round(n * 10) / 10;

// The first-party counter went live on 2026-06-10; until it has a meaningful
// sample, a visitors-based rate would be nonsense (e.g. 10 leads / 2 visitors).
export const MIN_VISITORS_FOR_RATE = 30;

export function computeUnitEconomics(input: UnitEconomicsInput): UnitEconomics {
  const { visitors30, leads30, totalLeads, wonLeads, pipelineActive } = input;

  const leadRate = visitors30 >= MIN_VISITORS_FOR_RATE ? leads30 / visitors30 : null;
  const winRate = totalLeads > 0 && wonLeads > 0 ? wonLeads / totalLeads : null;

  return {
    leadRatePct: leadRate === null ? null : round1(leadRate * 100),
    winRatePct: winRate === null ? null : round1(winRate * 100),
    visitorToClientPct:
      leadRate === null || winRate === null ? null : round1(leadRate * winRate * 100),
    valuePerLead12m: winRate === null ? null : Math.round(winRate * REVENUE_12M),
    valuePerVisitor12m:
      leadRate === null || winRate === null ? null : Math.round(leadRate * winRate * REVENUE_12M),
    maxCacPayback6m: winRate === null ? null : Math.round(winRate * REVENUE_6M),
    pipelineValue12m: winRate === null ? null : Math.round(pipelineActive * winRate * REVENUE_12M),
    mrrPilot: wonLeads * PILOT_PRICE,
    mrrAfterPilot: wonLeads * FULL_PRICE,
  };
}

// Human formatting for so'm amounts in the admin (RU).
export function fmtSum(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    const m = n / 1_000_000;
    const s = (Math.round(m * 10) / 10).toLocaleString("ru-RU");
    return `${s} млн сум`;
  }
  return `${n.toLocaleString("ru-RU")} сум`;
}
