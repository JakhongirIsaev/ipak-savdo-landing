import { sql, and, gte, lt } from "drizzle-orm";
import type { LeadStatus } from "@/lib/db/schema";

// Lazy DB import so the module can be imported in unit tests without DATABASE_URL
function getDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { db, leads } = require("@/lib/db") as typeof import("@/lib/db");
  return { db, leads };
}

const TZ = "Asia/Tashkent";

// ─── Pure date helpers ───────────────────────────────────────────────────────

export function tashkentDayStart(now: Date): Date {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return new Date(`${get("year")}-${get("month")}-${get("day")}T00:00:00+05:00`);
}

export function tashkentDayEnd(now: Date): Date {
  const start = tashkentDayStart(now);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000);
}

export function deltaPercent(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

// ─── DB-backed KPIs ──────────────────────────────────────────────────────────

export interface KpiCounts {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  total: number;
}

export async function getLeadCounts(now: Date = new Date()): Promise<KpiCounts> {
  const todayStart = tashkentDayStart(now);
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
  const todayEnd = tashkentDayEnd(now);
  const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(todayStart.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(todayStart.getTime() - 60 * 24 * 60 * 60 * 1000);

  const { db, leads } = getDb();

  const countSince = async (from: Date, to: Date) => {
    const rows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(leads)
      .where(and(gte(leads.createdAt, from), lt(leads.createdAt, to)));
    return rows[0]?.n ?? 0;
  };

  const totalRows = await db.select({ n: sql<number>`count(*)::int` }).from(leads);

  return {
    today: await countSince(todayStart, todayEnd),
    yesterday: await countSince(yesterdayStart, todayStart),
    thisWeek: await countSince(sevenDaysAgo, todayEnd),
    lastWeek: await countSince(fourteenDaysAgo, sevenDaysAgo),
    thisMonth: await countSince(thirtyDaysAgo, todayEnd),
    lastMonth: await countSince(sixtyDaysAgo, thirtyDaysAgo),
    total: totalRows[0]?.n ?? 0,
  };
}

export interface FunnelCount {
  status: LeadStatus;
  count: number;
}

export async function getFunnel(): Promise<FunnelCount[]> {
  const { db, leads } = getDb();
  const rows = await db
    .select({ status: leads.status, count: sql<number>`count(*)::int` })
    .from(leads)
    .groupBy(leads.status);
  const order: LeadStatus[] = ["new", "contacted", "demo", "won", "lost"];
  return order.map((s) => ({
    status: s,
    count: rows.find((r) => r.status === s)?.count ?? 0,
  }));
}

export async function getConversionRate(): Promise<number | null> {
  const { db, leads } = getDb();
  const rows = await db
    .select({
      total: sql<number>`count(*)::int`,
      won: sql<number>`count(*) FILTER (WHERE ${leads.status} = 'won')::int`,
    })
    .from(leads);
  const r = rows[0];
  if (!r || r.total === 0) return null;
  return Math.round((r.won / r.total) * 100);
}

export async function getMedianTimeToContactSec(): Promise<number | null> {
  const { db } = getDb();
  const rows = await db.execute(sql`
    SELECT percentile_cont(0.5) WITHIN GROUP (
      ORDER BY EXTRACT(epoch FROM (e2.created_at - e1.created_at))
    ) AS median_sec
    FROM lead_events e1
    JOIN lead_events e2 ON e1.lead_id = e2.lead_id
    WHERE e1.from_status IS NULL AND e1.to_status = 'new'
      AND e2.from_status = 'new' AND e2.to_status = 'contacted'
  `);
  const row = (rows as any).rows?.[0] ?? (rows as any)[0];
  const median = row?.median_sec;
  if (median === null || median === undefined) return null;
  return Math.round(Number(median));
}

export interface DailyBySource {
  day: string;
  source: string;
  count: number;
}

export async function getDailyLeadsBySource(days = 30): Promise<DailyBySource[]> {
  const { db } = getDb();
  const rows = await db.execute(sql`
    SELECT
      to_char(date_trunc('day', created_at AT TIME ZONE 'Asia/Tashkent'), 'YYYY-MM-DD') AS day,
      source,
      count(*)::int AS count
    FROM leads
    WHERE created_at >= now() - (${days} || ' days')::interval
    GROUP BY day, source
    ORDER BY day
  `);
  return ((rows as any).rows ?? rows) as DailyBySource[];
}

export interface SourceStats {
  source: string;
  total: number;
  won: number;
  winRate: number;
}

export async function getTopSourcesByWinRate(limit = 5): Promise<SourceStats[]> {
  const { db } = getDb();
  const rows = await db.execute(sql`
    SELECT
      source,
      count(*)::int AS total,
      count(*) FILTER (WHERE status = 'won')::int AS won
    FROM leads
    GROUP BY source
    HAVING count(*) >= 1
    ORDER BY count(*) DESC
    LIMIT ${limit}
  `);
  const data = ((rows as any).rows ?? rows) as { source: string; total: number; won: number }[];
  return data.map((r) => ({
    source: r.source,
    total: r.total,
    won: r.won,
    winRate: r.total === 0 ? 0 : Math.round((r.won / r.total) * 100),
  }));
}
