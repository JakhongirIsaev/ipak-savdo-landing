import crypto from "node:crypto";

// Google Analytics 4 Data API via plain REST + a self-signed service-account JWT.
// No SDK / gRPC dependency. Runs server-side only (uses node:crypto + secrets).
//
// Required env (set on Railway when the key is ready):
//   GA_PROPERTY_ID      — numeric GA4 property id (NOT the G-XXXX measurement id)
//   GA_CREDENTIALS_JSON — full service-account JSON (the downloaded key file)

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const DATA_API = "https://analyticsdata.googleapis.com/v1beta";

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function getCreds(): ServiceAccount | null {
  const raw = process.env.GA_CREDENTIALS_JSON;
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

function getPropertyId(): string | null {
  const id = process.env.GA_PROPERTY_ID;
  if (!id) return null;
  const digits = id.replace(/[^0-9]/g, "");
  return digits || null;
}

export function gaConfigured(): boolean {
  return Boolean(getCreds() && getPropertyId());
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
  if (!res.ok) throw new Error(`GA token error ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  tokenCache = { token: data.access_token, exp: now + (data.expires_in ?? 3600) };
  return data.access_token;
}

interface GaRow {
  dimensionValues?: { value?: string }[];
  metricValues?: { value?: string }[];
}
interface GaReport {
  rows?: GaRow[];
}
interface GaBatchResponse {
  reports?: GaReport[];
}

export interface GaStats {
  users: number;
  sessions: number;
  views: number;
  sources: { label: string; sessions: number }[];
  pages: { path: string; views: number }[];
  devices: { label: string; sessions: number }[];
  cities: { label: string; sessions: number }[];
  rangeDays: number;
}

let statsCache: { data: GaStats; exp: number } | null = null;

const num = (s: string | undefined): number => (s ? parseInt(s, 10) || 0 : 0);

// GA4 batchRunReports rejects more than 5 requests per call — chunk and merge.
const BATCH_LIMIT = 5;

async function runBatchedReports(token: string, propertyId: string, requests: unknown[]): Promise<GaReport[]> {
  const reports: GaReport[] = [];
  for (let i = 0; i < requests.length; i += BATCH_LIMIT) {
    const res = await fetch(`${DATA_API}/properties/${propertyId}:batchRunReports`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ requests: requests.slice(i, i + BATCH_LIMIT) }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`GA report error ${res.status}`);
    const json = (await res.json()) as GaBatchResponse;
    reports.push(...(json.reports ?? []));
  }
  return reports;
}

export async function getGaStats(rangeDays = 30): Promise<GaStats | null> {
  const sa = getCreds();
  const propertyId = getPropertyId();
  if (!sa || !propertyId) return null;

  const now = Date.now();
  if (statsCache && statsCache.exp > now) return statsCache.data;

  try {
    const token = await getAccessToken(sa);
    const dateRanges = [{ startDate: `${rangeDays}daysAgo`, endDate: "today" }];
    const requests = [
        { dateRanges, metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }] },
        {
          dateRanges,
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 6,
        },
        {
          dateRanges,
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 6,
        },
        {
          dateRanges,
          dimensions: [{ name: "deviceCategory" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        },
        {
          dateRanges,
          dimensions: [{ name: "city" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 8,
        },
    ];

    const reports = await runBatchedReports(token, propertyId, requests);
    const totals = reports[0]?.rows?.[0];

    const stats: GaStats = {
      users: num(totals?.metricValues?.[0]?.value),
      sessions: num(totals?.metricValues?.[1]?.value),
      views: num(totals?.metricValues?.[2]?.value),
      sources: (reports[1]?.rows ?? []).map((r) => ({
        label: channelLabel(r.dimensionValues?.[0]?.value),
        sessions: num(r.metricValues?.[0]?.value),
      })),
      pages: (reports[2]?.rows ?? []).map((r) => ({
        path: r.dimensionValues?.[0]?.value ?? "—",
        views: num(r.metricValues?.[0]?.value),
      })),
      devices: (reports[3]?.rows ?? []).map((r) => ({
        label: deviceLabel(r.dimensionValues?.[0]?.value),
        sessions: num(r.metricValues?.[0]?.value),
      })),
      cities: (reports[4]?.rows ?? []).map((r) => ({
        label: cityLabel(r.dimensionValues?.[0]?.value),
        sessions: num(r.metricValues?.[0]?.value),
      })),
      rangeDays,
    };

    statsCache = { data: stats, exp: now + 5 * 60 * 1000 };
    return stats;
  } catch {
    return null;
  }
}

const CHANNEL_LABELS: Record<string, string> = {
  Direct: "Прямые заходы",
  "Organic Search": "Поиск",
  "Organic Social": "Соцсети",
  Referral: "Переходы",
  "Paid Search": "Реклама (поиск)",
  "Paid Social": "Реклама (соцсети)",
  Email: "Email",
  Unassigned: "Прочее",
};

function channelLabel(v: string | undefined): string {
  if (!v) return "—";
  return CHANNEL_LABELS[v] ?? v;
}

function deviceLabel(v: string | undefined): string {
  if (v === "desktop") return "Компьютер";
  if (v === "mobile") return "Телефон";
  if (v === "tablet") return "Планшет";
  return v ?? "—";
}

function cityLabel(v: string | undefined): string {
  if (!v || v === "(not set)") return "Не определено";
  return v;
}
