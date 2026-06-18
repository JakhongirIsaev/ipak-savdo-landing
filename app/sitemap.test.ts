import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { POSTS, BLOG_CATEGORIES, postsByCategory } from "@/lib/blog";

const SITE = "https://birliy.uz";
const LOCALE_PREFIX = ["", "/ru", "/en"] as const;

const entries = sitemap();
const byUrl = new Map(entries.map((e) => [e.url, e]));
const latestArticleDate = POSTS.reduce(
  (max, p) => ((p.modified ?? p.date) > max ? p.modified ?? p.date : max),
  "0000-00-00",
);

describe("sitemap", () => {
  it("includes the two landing pages with a stable, non-build-time lastModified", () => {
    const home = byUrl.get(SITE);
    const ru = byUrl.get(`${SITE}/ru`);
    expect(home).toBeTruthy();
    expect(ru).toBeTruthy();
    // A fixed YYYY-MM-DD string (not a per-build Date) so deploys don't bump it.
    expect(typeof home!.lastModified).toBe("string");
    expect(home!.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(home!.lastModified).toBe(ru!.lastModified);
  });

  it("includes every article exactly once per locale (uz/ru/en)", () => {
    for (const post of POSTS) {
      for (const prefix of LOCALE_PREFIX) {
        const url = `${SITE}${prefix}/blog/${post.slug}`;
        expect(entries.filter((e) => e.url === url), url).toHaveLength(1);
      }
    }
  });

  it("uses post.modified ?? post.date for each article lastModified", () => {
    for (const post of POSTS) {
      const expected = post.modified ?? post.date;
      for (const prefix of LOCALE_PREFIX) {
        const e = byUrl.get(`${SITE}${prefix}/blog/${post.slug}`);
        expect(e!.lastModified, e!.url).toBe(expected);
      }
    }
  });

  it("gives every blog index the latest genuine article modification date", () => {
    for (const prefix of LOCALE_PREFIX) {
      const e = byUrl.get(`${SITE}${prefix}/blog`);
      expect(e, `${prefix}/blog`).toBeTruthy();
      expect(e!.lastModified).toBe(latestArticleDate);
    }
  });

  it("carries uz/ru/en + x-default hreflang on every blog URL", () => {
    const blogEntries = entries.filter((e) => e.url.includes("/blog"));
    expect(blogEntries.length).toBeGreaterThan(0);
    for (const e of blogEntries) {
      const langs = e.alternates?.languages ?? {};
      expect(Object.keys(langs).sort(), e.url).toEqual(["en", "ru", "uz", "x-default"]);
    }
  });

  it("carries uz/ru + x-default hreflang on the landing URLs", () => {
    for (const url of [SITE, `${SITE}/ru`]) {
      const langs = byUrl.get(url)!.alternates?.languages ?? {};
      expect(Object.keys(langs).sort()).toEqual(["ru", "uz", "x-default"]);
    }
  });

  it("excludes admin and api routes", () => {
    for (const e of entries) {
      expect(e.url).not.toContain("/admin");
      expect(e.url).not.toContain("/api");
    }
  });

  it("includes ONLY non-empty category indexes (one per locale); excludes empty ones", () => {
    for (const category of BLOG_CATEGORIES) {
      const expected = postsByCategory(category).length > 0 ? 1 : 0;
      for (const prefix of LOCALE_PREFIX) {
        const url = `${SITE}${prefix}/blog/category/${category}`;
        expect(entries.filter((e) => e.url === url), url).toHaveLength(expected);
      }
    }
  });

  it("keeps product (has posts) in the sitemap and excludes ai-tech/football (empty)", () => {
    for (const prefix of LOCALE_PREFIX) {
      expect(byUrl.has(`${SITE}${prefix}/blog/category/product`), `${prefix} product`).toBe(true);
      expect(byUrl.has(`${SITE}${prefix}/blog/category/ai-tech`), `${prefix} ai-tech`).toBe(false);
      expect(byUrl.has(`${SITE}${prefix}/blog/category/football`), `${prefix} football`).toBe(false);
    }
  });

  it("carries uz/ru/en + x-default hreflang on every (non-empty) category index", () => {
    const nonEmpty = BLOG_CATEGORIES.filter((c) => postsByCategory(c).length > 0);
    const categoryEntries = entries.filter((e) => e.url.includes("/blog/category/"));
    expect(categoryEntries.length).toBe(nonEmpty.length * 3);
    for (const e of categoryEntries) {
      const langs = e.alternates?.languages ?? {};
      expect(Object.keys(langs).sort(), e.url).toEqual(["en", "ru", "uz", "x-default"]);
    }
  });
});
