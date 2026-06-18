import crypto from "node:crypto";

// Google Search Console Search Analytics API via plain REST + a self-signed service-account JWT.
// No SDK dependency. Runs server-side only (uses node:crypto + secrets).
//
// Required env:
//   GA_CREDENTIALS_JSON                   — service-account JSON used for GA4 (primary)
//   GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON — alternative creds env (takes precedence if set)
//   GSC_SITE_URL                          — optional, defaults to "https://birliy.uz/"
//   GOOGLE_SEARCH_CONSOLE_SITE_URL        — alternative site-url env (takes precedence if set)

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const SITE_URL =
  process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ?? process.env.GSC_SITE_URL ?? "https://birliy.uz/";

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function getCreds(): ServiceAccount | null {
  const raw =
    process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON ?? process.env.GA_CREDENTIALS_JSON;
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as { client_email?: string; private_key?: string };
    if (!j.client_email || !j.private_key) return null;
    // Railway often stores the key with escaped newlines — restore them.
    return { client_email: j.client_email, private_key: j.private_key.replace(/\\n/g, "\n") };
  } catch {
    return null;
  }
}

export function gscConfigured(): boolean {
  return Boolean(getCreds());
}

// The service-account email DERIVED from the configured credentials (never
// hardcoded). Returns null when no creds are set. Lets the admin empty state
// show which account to grant access to the Search Console property.
export function gscServiceAccountEmail(): string | null {
  return getCreds()?.client_email ?? null;
}

// The configured Search Console property id (e.g. "sc-domain:birliy.uz" or a
// URL-prefix), for display in the admin empty/error states.
export function gscSiteUrl(): string {
  return SITE_URL;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

let tokenCache: { token: string; exp: number } | null = null;

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.exp - 60 > now) return tokenCache.token;

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  );
  const signingInput = `${header}.${claims}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingInput);
  const jwt = `${signingInput}.${base64url(signer.sign(sa.private_key))}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GSC token error ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  tokenCache = { token: data.access_token, exp: now + (data.expires_in ?? 3600) };
  return data.access_token;
}

export interface GscRow {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscStats {
  totals: { clicks: number; impressions: number; ctr: number; position: number } | null;
  queries: GscRow[];
  pages: GscRow[];
  range: { start: string; end: string };
}

// GSC data lags ~2 days.
function getDateRange(): { startDate: string; endDate: string } {
  const end = new Date();
  end.setDate(end.getDate() - 2);
  const start = new Date(end);
  start.setDate(start.getDate() - 27);
  const fmt = (d: Date): string => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

interface GscApiRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GscApiResponse {
  rows?: GscApiRow[];
}

const SEARCH_URL = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;

async function queryGsc(token: string, body: object): Promise<GscApiResponse> {
  const res = await fetch(SEARCH_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GSC query error ${res.status}`);
  return (await res.json()) as GscApiResponse;
}

// Strip origin from page keys for display.
function stripOrigin(key: string): string {
  try {
    const u = new URL(key);
    return u.pathname + (u.search || "");
  } catch {
    return key;
  }
}

// ─── Search Growth ────────────────────────────────────────────────────────────

export interface SearchGrowthDay {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchGrowth {
  range: { start: string; end: string; days: number };
  daily: SearchGrowthDay[];
  totals: { clicks: number; impressions: number; ctr: number; position: number } | null;
  queries: GscRow[];
  pages: GscRow[];
}

/** Returns daily GSC metrics for a rolling window (7 / 28 / 90 days). */
export async function getSearchGrowth(rangeDays: number): Promise<SearchGrowth | null> {
  const sa = getCreds();
  if (!sa) return null;

  try {
    const token = await getAccessToken(sa);

    // End date = today - 2 (GSC data lags ~2 days), start = end - (rangeDays - 1).
    const endD = new Date();
    endD.setDate(endD.getDate() - 2);
    const startD = new Date(endD);
    startD.setDate(startD.getDate() - (rangeDays - 1));
    const fmtDate = (d: Date): string => d.toISOString().slice(0, 10);
    const startDate = fmtDate(startD);
    const endDate = fmtDate(endD);
    const base = { startDate, endDate };

    const [dailyRes, totalsRes, queriesRes, pagesRes] = await Promise.all([
      queryGsc(token, {
        ...base,
        dimensions: ["date"],
        rowLimit: 100,
        orderBy: [{ fieldName: "date", sortOrder: "ASCENDING" }],
      }),
      queryGsc(token, { ...base, rowLimit: 1 }),
      queryGsc(token, { ...base, dimensions: ["query"], rowLimit: 10 }),
      queryGsc(token, { ...base, dimensions: ["page"], rowLimit: 5 }),
    ]);

    const daily: SearchGrowthDay[] = (dailyRes.rows ?? []).map((r) => ({
      date: r.keys?.[0] ?? "",
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));

    const totalsRow = totalsRes.rows?.[0] ?? null;

    return {
      range: { start: startDate, end: endDate, days: rangeDays },
      daily,
      totals: totalsRow
        ? {
            clicks: totalsRow.clicks,
            impressions: totalsRow.impressions,
            ctr: totalsRow.ctr,
            position: totalsRow.position,
          }
        : null,
      queries: (queriesRes.rows ?? []).map((r) => ({
        key: r.keys?.[0] ?? "",
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
      pages: (pagesRes.rows ?? []).map((r) => ({
        key: stripOrigin(r.keys?.[0] ?? ""),
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
    };
  } catch {
    return null;
  }
}

// ─── Original getGscStats (unchanged) ────────────────────────────────────────

export async function getGscStats(): Promise<GscStats | null> {
  const sa = getCreds();
  if (!sa) return null;

  const { startDate, endDate } = getDateRange();
  const base = { startDate, endDate };

  try {
    const token = await getAccessToken(sa);

    const [totalsRes, queriesRes, pagesRes] = await Promise.all([
      queryGsc(token, { ...base, rowLimit: 1 }),
      queryGsc(token, { ...base, dimensions: ["query"], rowLimit: 10 }),
      queryGsc(token, { ...base, dimensions: ["page"], rowLimit: 5 }),
    ]);

    const totalsRow = totalsRes.rows?.[0] ?? null;

    return {
      totals: totalsRow
        ? {
            clicks: totalsRow.clicks,
            impressions: totalsRow.impressions,
            ctr: totalsRow.ctr,
            position: totalsRow.position,
          }
        : null,
      queries: (queriesRes.rows ?? []).map((r) => ({
        key: r.keys?.[0] ?? "",
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
      pages: (pagesRes.rows ?? []).map((r) => ({
        key: stripOrigin(r.keys?.[0] ?? ""),
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
      range: { start: startDate, end: endDate },
    };
  } catch {
    return null;
  }
}
