import { describe, expect, it } from "vitest";
import { SEO_KEYWORD_PAGES, seoKeywordPagesForLocale } from "./keyword-pages";

function visibleCopy(page: (typeof SEO_KEYWORD_PAGES)[number]): string {
  return [
    page.eyebrow,
    page.h1,
    page.intro,
    page.title,
    page.description,
    page.ogTitle,
    page.ogDescription,
    page.helper.title,
    page.helper.body,
    page.price.title,
    page.price.body,
    page.finalCta.title,
    page.finalCta.body,
    ...page.price.bullets,
    ...page.steps,
    ...page.problems.flatMap((item) => [item.title, item.problem, item.solution]),
    ...page.features.flatMap((item) => [item.title, item.text]),
    ...page.faq.flatMap((item) => [item.q, item.a]),
  ].join("\n");
}

describe("SEO keyword pages", () => {
  it("defines the requested UZ and RU routes", () => {
    expect(seoKeywordPagesForLocale("uz").map((page) => page.path)).toEqual([
      "/uz/dokon-uchun-programma",
      "/uz/dokon-kassa",
      "/uz/magazin-uchun-programma",
      "/uz/nasiya-daftar",
      "/uz/ombor-dasturi",
      "/uz/telefon-kassa",
    ]);
    expect(seoKeywordPagesForLocale("ru").map((page) => page.path)).toEqual([
      "/ru/programma-dlya-magazina",
      "/ru/kassa-dlya-magazina",
      "/ru/uchet-dolgov-magazin",
    ]);
  });

  it("keeps paths and slugs unique", () => {
    expect(new Set(SEO_KEYWORD_PAGES.map((page) => page.path)).size).toBe(SEO_KEYWORD_PAGES.length);
    expect(new Set(SEO_KEYWORD_PAGES.map((page) => `${page.locale}:${page.slug}`)).size).toBe(SEO_KEYWORD_PAGES.length);
  });

  it("has the required visible content blocks without public em dashes", () => {
    for (const page of SEO_KEYWORD_PAGES) {
      expect(page.h1.length, page.path).toBeGreaterThan(10);
      expect(page.problems, page.path).toHaveLength(3);
      expect(page.steps, page.path).toHaveLength(4);
      expect(page.features.length, page.path).toBeGreaterThanOrEqual(6);
      expect(page.faq.length, page.path).toBeGreaterThanOrEqual(5);
      expect(visibleCopy(page), page.path).not.toContain("—");
    }
  });
});
