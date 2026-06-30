import type { BlogLocale, BlogPost, BlogCategory } from "./types";
import { post as choosePos } from "./posts/kak-vybrat-kassu-dlya-magazina";
import { post as notebookLosses } from "./posts/uchet-v-tetradi-skolko-teryaet-magazin";
import { post as inventoryGuide } from "./posts/skladskoy-uchet-v-malenkom-magazine";
import { post as minimarketPosGuide } from "./posts/pos-tizimi-uzbekistan-minimarket";
// Product expansion (2026-06-19)
import { post as kassaApparatsizSavdo } from "./posts/kassa-apparatsiz-savdo";
import { post as magazinUchunDastur } from "./posts/magazin-uchun-dastur-telefonda-savdo";
import { post as qarzDaftarOrniga } from "./posts/qarz-daftar-orniga-nima";
import { post as dokondaNimaQolgan } from "./posts/dokonda-nima-qolganini-telefondan-bilish";
// AI & technology (2026-06-19)
import { post as aiQidiruvAgentlar } from "./posts/ai-qidiruv-va-agentlar-kichik-biznes";
import { post as aiFoydaMalumotlar } from "./posts/ai-dan-foyda-malumotlar-va-nazorat";
import { post as debtNotebookSmallShop } from "./posts/debt-notebook-small-shop";
import { post as posTizimMagazinUchun } from "./posts/pos-tizim-magazin-uchun";
import { post as miniMarketDasturi } from "./posts/mini-market-dasturi";
import { post as posTizimDokonEgasigaYordam } from "./posts/pos-tizim-dokon-egasiga-yordam";
import { post as miniMarketDasturiKassaOmborNasiya } from "./posts/mini-market-dasturi-kassa-ombor-nasiya";

// Newest first: this order drives the blog index pages.
export const POSTS: BlogPost[] = [
  miniMarketDasturiKassaOmborNasiya,
  posTizimDokonEgasigaYordam,
  miniMarketDasturi,
  posTizimMagazinUchun,
  debtNotebookSmallShop,
  kassaApparatsizSavdo,
  magazinUchunDastur,
  qarzDaftarOrniga,
  dokondaNimaQolgan,
  aiQidiruvAgentlar,
  aiFoydaMalumotlar,
  minimarketPosGuide,
  choosePos,
  notebookLosses,
  inventoryGuide,
];

export const BLOG_CATEGORIES = ["product", "ai-tech"] as const;

export function postCategory(post: BlogPost): BlogCategory {
  return post.category ?? "product";
}

export function postsByCategory(category: BlogCategory): BlogPost[] {
  return POSTS.filter((p) => postCategory(p) === category);
}

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function allSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}

const WORDS_PER_MINUTE = 180;

export function readingTimeMin(post: BlogPost, locale: BlogLocale): number {
  const c = post.locales[locale];
  const text = [
    ...c.intro,
    ...c.sections.flatMap((s) => [s.h2, ...s.paragraphs, ...(s.list ?? [])]),
    ...c.faq.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export type { BlogLocale, BlogPost, BlogCategory } from "./types";
