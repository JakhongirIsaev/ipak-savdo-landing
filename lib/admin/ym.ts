// Yandex Metrika Stat API via plain REST.
// Auth: long-lived OAuth token — no JWT, no token exchange.
// No SDK / extra dependencies. Runs server-side only (secrets in env).
//
// Required env (set on Railway):
//   YANDEX_METRIKA_OAUTH_TOKEN — long-lived OAuth token from Yandex
//   YANDEX_METRIKA_COUNTER_ID  — numeric counter id (e.g. "12345678")

const BASE_DATA = "https://api-metrika.yandex.net/stat/v1/data";
const BASE_BYTIME = "https://api-metrika.yandex.net/stat/v1/data/bytime";

function getToken(): string | null {
  return process.env.YANDEX_METRIKA_OAUTH_TOKEN ?? null;
}

function getCounterId(): string | null {
  const id = process.env.YANDEX_METRIKA_COUNTER_ID;
  if (!id) return null;
  const digits = id.replace(/[^0-9]/g, "");
  return digits || null;
}

export function ymConfigured(): boolean {
  return Boolean(getToken() && getCounterId());
}

// ─── Public interfaces ──────────────────────────────────────────────────────

export interface YmTimeSeries {
  dates: string[];
  visits: number[];
  users: number[];
}

export interface YmSource {
  id: string;
  label: string;
  visits: number;
  users: number;
  bounceRate: number;
  pageDepth: number;
  avgDuration: number;
}

export interface YmOrganic {
  visits: number;
  users: number;
  bounceRate: number;
  pageDepth: number;
  avgDuration: number;
}

export interface YmLanding {
  path: string;
  visits: number;
  pageDepth: number;
  avgDuration: number;
  bounceRate: number;
}

export interface YmTotals {
  visits: number;
  users: number;
  bounceRate: number;
  pageDepth: number;
  avgDuration: number;
}

export interface YmStats {
  timeSeries: YmTimeSeries;
  sources: YmSource[];
  organic: YmOrganic;
  landings: YmLanding[];
  totals: YmTotals;
  rangeDays: number;
}

// ─── Raw API shapes ──────────────────────────────────────────────────────────

interface YmByTimeRow {
  metrics: number[][];
}

interface YmByTimeResponse {
  data?: YmByTimeRow[];
  time_intervals?: [string, string][];
}

interface YmDataDimension {
  id?: string;
  name?: string;
}

interface YmDataRow {
  dimensions?: YmDataDimension[];
  metrics?: number[];
}

interface YmDataResponse {
  data?: YmDataRow[];
  totals?: number[];
}

// ─── Cache ───────────────────────────────────────────────────────────────────

let statsCache: { data: YmStats; exp: number } | null = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function n(v: number | undefined): number {
  return typeof v === "number" && isFinite(v) ? v : 0;
}

function makeDateRange(rangeDays: number): { date1: string; date2: string } {
  return { date1: `${rangeDays}daysAgo`, date2: "today" };
}

// Fetch wrapper: returns parsed JSON or null on any HTTP/network error.
async function ymFetch<T>(url: URL, token: string): Promise<T | null> {
  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `OAuth ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const SOURCE_LABELS: Record<string, string> = {
  organic: "Поиск",
  direct: "Прямые заходы",
  referral: "Переходы",
  social: "Соцсети",
  ad: "Реклама",
  email: "Email",
  messenger: "Мессенджеры",
  recommend: "Рекомендации",
  internal: "Внутренний",
};

function sourceLabel(id: string | undefined, name: string | undefined): string {
  if (!id) return name ?? "—";
  return SOURCE_LABELS[id] ?? name ?? id;
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function getYmStats(rangeDays = 30): Promise<YmStats | null> {
  const token = getToken();
  const counterId = getCounterId();
  if (!token || !counterId) return null;

  const now = Date.now();
  if (statsCache && statsCache.exp > now) return statsCache.data;

  try {
    const { date1, date2 } = makeDateRange(rangeDays);
    const commonMetrics = "ym:s:visits,ym:s:users,ym:s:bounceRate,ym:s:pageDepth,ym:s:avgVisitDurationSeconds";

    // ── 1. Visits + users by day (bytime) ──────────────────────────────────
    const byTimeUrl = new URL(BASE_BYTIME);
    byTimeUrl.searchParams.set("ids", counterId);
    byTimeUrl.searchParams.set("metrics", "ym:s:visits,ym:s:users");
    byTimeUrl.searchParams.set("group", "day");
    byTimeUrl.searchParams.set("date1", date1);
    byTimeUrl.searchParams.set("date2", date2);
    byTimeUrl.searchParams.set("lang", "ru");

    // ── 2. Traffic sources ─────────────────────────────────────────────────
    const sourcesUrl = new URL(BASE_DATA);
    sourcesUrl.searchParams.set("ids", counterId);
    sourcesUrl.searchParams.set("dimensions", "ym:s:lastTrafficSource");
    sourcesUrl.searchParams.set("metrics", commonMetrics);
    sourcesUrl.searchParams.set("sort", "-ym:s:visits");
    sourcesUrl.searchParams.set("limit", "10");
    sourcesUrl.searchParams.set("date1", date1);
    sourcesUrl.searchParams.set("date2", date2);
    sourcesUrl.searchParams.set("lang", "ru");

    // ── 3. Organic totals ──────────────────────────────────────────────────
    const organicUrl = new URL(BASE_DATA);
    organicUrl.searchParams.set("ids", counterId);
    organicUrl.searchParams.set("metrics", commonMetrics);
    organicUrl.searchParams.set("date1", date1);
    organicUrl.searchParams.set("date2", date2);
    organicUrl.searchParams.set("lang", "ru");
    // URLSearchParams.set encodes the value once — safe to use special chars.
    organicUrl.searchParams.set("filters", "ym:s:lastTrafficSource=='organic'");

    // ── 4. Top landing pages ───────────────────────────────────────────────
    const landingsUrl = new URL(BASE_DATA);
    landingsUrl.searchParams.set("ids", counterId);
    landingsUrl.searchParams.set("dimensions", "ym:s:startURLPath");
    landingsUrl.searchParams.set(
      "metrics",
      "ym:s:visits,ym:s:pageDepth,ym:s:avgVisitDurationSeconds,ym:s:bounceRate",
    );
    landingsUrl.searchParams.set("sort", "-ym:s:visits");
    landingsUrl.searchParams.set("limit", "10");
    landingsUrl.searchParams.set("date1", date1);
    landingsUrl.searchParams.set("date2", date2);
    landingsUrl.searchParams.set("lang", "ru");

    // ── 5. Overall totals ──────────────────────────────────────────────────
    const totalsUrl = new URL(BASE_DATA);
    totalsUrl.searchParams.set("ids", counterId);
    totalsUrl.searchParams.set("metrics", commonMetrics);
    totalsUrl.searchParams.set("date1", date1);
    totalsUrl.searchParams.set("date2", date2);
    totalsUrl.searchParams.set("lang", "ru");

    const [byTimeRaw, sourcesRaw, organicRaw, landingsRaw, totalsRaw] = await Promise.all([
      ymFetch<YmByTimeResponse>(byTimeUrl, token),
      ymFetch<YmDataResponse>(sourcesUrl, token),
      ymFetch<YmDataResponse>(organicUrl, token),
      ymFetch<YmDataResponse>(landingsUrl, token),
      ymFetch<YmDataResponse>(totalsUrl, token),
    ]);

    // All requests must succeed (null = auth/API failure).
    if (!byTimeRaw || !sourcesRaw || !organicRaw || !landingsRaw || !totalsRaw) return null;

    // ── Parse bytime ───────────────────────────────────────────────────────
    // data[0].metrics[k] is an array — one value per interval.
    const intervals = byTimeRaw.time_intervals ?? [];
    const visitsRow = byTimeRaw.data?.[0]?.metrics?.[0] ?? [];
    const usersRow = byTimeRaw.data?.[0]?.metrics?.[1] ?? [];

    const timeSeries: YmTimeSeries = {
      dates: intervals.map(([start]) => start),
      visits: visitsRow.map((v) => n(v)),
      users: usersRow.map((v) => n(v)),
    };

    // ── Parse sources ──────────────────────────────────────────────────────
    const sources: YmSource[] = (sourcesRaw.data ?? []).map((row) => {
      const dim = row.dimensions?.[0];
      const m = row.metrics ?? [];
      return {
        id: dim?.id ?? "",
        label: sourceLabel(dim?.id, dim?.name),
        visits: n(m[0]),
        users: n(m[1]),
        bounceRate: n(m[2]),
        pageDepth: n(m[3]),
        avgDuration: n(m[4]),
      };
    });

    // ── Parse organic totals ───────────────────────────────────────────────
    const ot = organicRaw.totals ?? [];
    const organic: YmOrganic = {
      visits: n(ot[0]),
      users: n(ot[1]),
      bounceRate: n(ot[2]),
      pageDepth: n(ot[3]),
      avgDuration: n(ot[4]),
    };

    // ── Parse landings ─────────────────────────────────────────────────────
    const landings: YmLanding[] = (landingsRaw.data ?? []).map((row) => {
      const m = row.metrics ?? [];
      return {
        path: row.dimensions?.[0]?.name ?? row.dimensions?.[0]?.id ?? "—",
        visits: n(m[0]),
        pageDepth: n(m[1]),
        avgDuration: n(m[2]),
        bounceRate: n(m[3]),
      };
    });

    // ── Parse overall totals ───────────────────────────────────────────────
    const tt = totalsRaw.totals ?? [];
    const totals: YmTotals = {
      visits: n(tt[0]),
      users: n(tt[1]),
      bounceRate: n(tt[2]),
      pageDepth: n(tt[3]),
      avgDuration: n(tt[4]),
    };

    const stats: YmStats = { timeSeries, sources, organic, landings, totals, rangeDays };
    statsCache = { data: stats, exp: now + 5 * 60 * 1000 }; // 5-min cache
    return stats;
  } catch {
    return null;
  }
}
