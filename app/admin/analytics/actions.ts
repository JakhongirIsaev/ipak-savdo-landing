"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { checkBasicAuth } from "@/lib/admin/auth";
import { serpApiConfigured, getSerpCreditsLeft, fetchKeywordRank } from "@/lib/admin/serp";
import { TRACKED_KEYWORDS } from "@/lib/seo/keywords";

// Lazy DB import so the module is safe at build time.
function getDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { db } = require("@/lib/db") as typeof import("@/lib/db");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { keywordRanks } = require("@/lib/db/schema") as typeof import("@/lib/db/schema");
  return { db, keywordRanks };
}

const CHUNK_SIZE = 3;

// Defense-in-depth: re-verify admin Basic Auth INSIDE the action, using the same
// helper + env as the /admin middleware. The page is already gated by the
// middleware, but a Server Action must fail CLOSED on its own: a missing auth
// env or a missing/invalid Authorization header means no credits check and no
// SerpApi call.
function isAdminRequest(): boolean {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (!user || !password) return false;
  return checkBasicAuth(headers().get("authorization"), { user, password });
}

export async function refreshSerpRanksAction(): Promise<{ ok: boolean; message: string }> {
  if (!isAdminRequest()) {
    return { ok: false, message: "Доступ запрещён" };
  }
  if (!serpApiConfigured()) {
    return { ok: false, message: "SERPAPI_API_KEY не настроен" };
  }

  const creditsLeft = await getSerpCreditsLeft();
  if (typeof creditsLeft === "number" && creditsLeft < TRACKED_KEYWORDS.length) {
    return {
      ok: false,
      message: `Недостаточно кредитов SerpApi (осталось ${creditsLeft}, нужно минимум ${TRACKED_KEYWORDS.length})`,
    };
  }

  const { db, keywordRanks } = getDb();
  let inserted = 0;

  // Process in chunks of CHUNK_SIZE to be rate-conscious.
  for (let i = 0; i < TRACKED_KEYWORDS.length; i += CHUNK_SIZE) {
    const chunk = TRACKED_KEYWORDS.slice(i, i + CHUNK_SIZE);
    for (const { keyword, locale } of chunk) {
      const rank = await fetchKeywordRank(keyword, locale);
      if (!rank) continue;
      try {
        await db.insert(keywordRanks).values({
          keyword,
          locale,
          engine: "google",
          location: "Tashkent,Uzbekistan",
          position: rank.position ?? undefined,
          urlFound: rank.urlFound ?? undefined,
          competitors: JSON.stringify(rank.competitors),
        });
        inserted++;
      } catch {
        // Skip individual insert failures; continue with remaining keywords.
      }
    }
  }

  revalidatePath("/admin/analytics");
  return { ok: true, message: `Обновлено: ${inserted} запросов` };
}
