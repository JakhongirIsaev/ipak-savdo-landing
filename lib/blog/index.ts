import type { BlogLocale, BlogPost, BlogCategory } from "./types";
import { post as choosePos } from "./posts/kak-vybrat-kassu-dlya-magazina";
import { post as notebookLosses } from "./posts/uchet-v-tetradi-skolko-teryaet-magazin";
import { post as inventoryGuide } from "./posts/skladskoy-uchet-v-malenkom-magazine";
import { post as minimarketPosGuide } from "./posts/pos-tizimi-uzbekistan-minimarket";

// Newest first: this order drives the blog index pages.
export const POSTS: BlogPost[] = [minimarketPosGuide, choosePos, notebookLosses, inventoryGuide];

export const BLOG_CATEGORIES = ["product", "ai-tech", "football"] as const;

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
