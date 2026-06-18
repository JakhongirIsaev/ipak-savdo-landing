// SerpApi integration — SERVER-SIDE ONLY.
// Never import this file from a client component.
//
// Required env:
//   SERPAPI_API_KEY — SerpApi account key (https://serpapi.com)
//
// All public functions fail soft: they return null / [] / false and never throw.
// SerpApi is NEVER called at module load, render, or build.

import { desc, eq, and } from "drizzle-orm";
import { TRACKED_KEYWORDS } from "@/lib/seo/keywords";

const SERP_BASE = "https://serpapi.com";

// ── Configuration ─────────────────────────────────────────────────────────────

function getApiKey(): string | null {
  return process.env.SERPAPI_API_KEY ?? null;
}

export function serpApiConfigured(): boolean {
  return Boolean(getApiKey());
}

// ── Account: credits left ─────────────────────────────────────────────────────

export async function getSerpCreditsLeft(): Promise<number | null> {
  const key = getApiKey();
  if (!key) return null;
  try {
    const res = await fetch(`${SERP_BASE}/account.json?api_key=${encodeURIComponent(key)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { searches_left?: number };
    if (typeof json.searches_left !== "number") return null;
    return json.searches_left;
  } catch {
    return null;
  }
}

// ── Single-keyword rank fetch ─────────────────────────────────────────────────

export interface SerpRankResult {
  position: number | null;
  urlFound: string | null;
  competitors: string[];
}

interface OrganicResult {
  position?: number;
  link?: string;
}

interface SerpApiResponse {
  organic_results?: OrganicResult[];
}

export async function fetchKeywordRank(
  keyword: string,
  locale: "uz" | "ru",
): Promise<SerpRankResult | null> {
  const key = getApiKey();
  if (!key) return null;
  try {
    const params = new URLSearchParams({
      engine: "google",
      q: keyword,
      api_key: key,
      location: "Tashkent,Uzbekistan",
      google_domain: "google.co.uz",
      gl: "uz",
      hl: locale,
      num: "10",
      output: "json",
    });
    const res = await fetch(`${SERP_BASE}/search.json?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as SerpApiResponse;
    const results = json.organic_results ?? [];

    let position: number | null = null;
    let urlFound: string | null = null;
    const competitors: string[] = [];

    for (const r of results) {
      if (!r.link) continue;
      let host: string;
      try {
        host = new URL(r.link).hostname.replace(/^www\./, "");
      } catch {
        continue;
      }
      if (host === "birliy.uz") {
        position = r.position ?? null;
        urlFound = r.link;
      } else if (competitors.length < 5) {
        competitors.push(host);
      }
    }

    return { position, urlFound, competitors };
  } catch {
    return null;
  }
}

// ── DB read helper ─────────────────────────────────────────────────────────────

export interface KeywordRankRow {
  keyword: string;
  locale: "uz" | "ru";
  // latest snapshot
  position: number | null;
  urlFound: string | null;
  competitors: string[];
  checkedAt: Date;
  // previous snapshot (null if this is the first one)
  prevPosition: number | null;
  prevCheckedAt: Date | null;
}

// Lazy DB import — avoids DATABASE_URL crash when the module is imported in
// environments where the DB is not yet initialised (build-time tree-shaking).
function getDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { db } = require("@/lib/db") as typeof import("@/lib/db");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { keywordRanks } = require("@/lib/db/schema") as typeof import("@/lib/db/schema");
  return { db, keywordRanks };
}

export async function getLatestKeywordRanks(): Promise<KeywordRankRow[]> {
  try {
    const { db, keywordRanks } = getDb();
    const result: KeywordRankRow[] = [];

    for (const { keyword, locale } of TRACKED_KEYWORDS) {
      // Fetch the two most recent snapshots for this (keyword, locale) pair.
      const rows = await db
        .select()
        .from(keywordRanks)
        .where(and(eq(keywordRanks.keyword, keyword), eq(keywordRanks.locale, locale)))
        .orderBy(desc(keywordRanks.checkedAt))
        .limit(2);

      if (rows.length === 0) continue;

      const latest = rows[0];
      const prev = rows[1] ?? null;

      let competitors: string[] = [];
      if (latest.competitors) {
        try {
          competitors = JSON.parse(latest.competitors) as string[];
        } catch {
          competitors = [];
        }
      }

      result.push({
        keyword: latest.keyword,
        locale: latest.locale as "uz" | "ru",
        position: latest.position ?? null,
        urlFound: latest.urlFound ?? null,
        competitors,
        checkedAt: latest.checkedAt,
        prevPosition: prev?.position ?? null,
        prevCheckedAt: prev?.checkedAt ?? null,
      });
    }

    return result;
  } catch {
    return [];
  }
}
