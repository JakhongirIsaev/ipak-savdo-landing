import { test, expect, type Page } from "@playwright/test";
import { POSTS } from "../lib/blog";

// ──────────────────────────────────────────────────────────────
// SEO / indexability verification for EVERY blog article in POSTS,
// across uz / ru / en, plus sitemap / feed / robots. Checks the
// signals Google needs to discover, crawl, understand and index a
// page (no ranking assertions).
// ──────────────────────────────────────────────────────────────

const SITE = "https://birliy.uz";
const LOCALES = ["uz", "ru", "en"] as const;

const postPath = (lang: string, slug: string) => (lang === "uz" ? `/blog/${slug}` : `/${lang}/blog/${slug}`);
const indexPath = (lang: string) => (lang === "uz" ? "/blog" : `/${lang}/blog`);
const altOf = (slug: string) => ({
  uz: `${SITE}/blog/${slug}`,
  ru: `${SITE}/ru/blog/${slug}`,
  en: `${SITE}/en/blog/${slug}`,
  "x-default": `${SITE}/blog/${slug}`,
});

async function jsonLdGraph(page: Page): Promise<any[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((b) => {
    const parsed = JSON.parse(b);
    return parsed["@graph"] ?? [parsed];
  });
}

for (const post of POSTS) {
  for (const lang of LOCALES) {
    const path = postPath(lang, post.slug);
    const c = post.locales[lang];

    test(`SEO ${lang} :: ${post.slug} :: indexable + structured data`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status(), `${path} status`).toBe(200);

      // No noindex.
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);

      // Self-referencing canonical.
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${path}`);

      // Reciprocal hreflang for uz / ru / en / x-default.
      const alt = altOf(post.slug);
      for (const hl of ["uz", "ru", "en", "x-default"] as const) {
        await expect(page.locator(`link[hreflang="${hl}"]`)).toHaveAttribute("href", alt[hl]);
      }

      // Exactly one H1.
      await expect(page.locator("h1")).toHaveCount(1);

      // Title + meta description present and matching the post content.
      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title).toContain(c.title.slice(0, 20));
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc).toBe(c.description);

      // og:image absolute + rss feed link exposed in head.
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/birliy\.uz\//);
      await expect(page.locator('link[type="application/rss+xml"]')).toHaveAttribute("href", `${SITE}/feed.xml`);

      // BlogPosting JSON-LD complete.
      const nodes = await jsonLdGraph(page);
      const article = nodes.find((n) => n["@type"] === "BlogPosting");
      expect(article, "BlogPosting node present").toBeTruthy();
      expect(article.headline).toBe(c.title);
      expect(article.description).toBe(c.description);
      expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(article.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(article.inLanguage).toBe(lang);
      expect(article.mainEntityOfPage).toBe(`${SITE}${path}`);
      const imageUrl =
        typeof article.image === "string"
          ? article.image
          : Array.isArray(article.image)
            ? article.image[0]
            : article.image?.url;
      expect(imageUrl).toMatch(/^https:\/\/birliy\.uz\//);
      expect(article.publisher?.name).toBe("BirLiy");
      expect(article.publisher?.logo?.url).toContain("birliy-wordmark");
      expect(article.author?.name).toBe("BirLiy");

      // BreadcrumbList + FAQPage JSON-LD present (reflecting visible content).
      expect(nodes.some((n) => n["@type"] === "BreadcrumbList"), "BreadcrumbList present").toBe(true);
      expect(nodes.some((n) => n["@type"] === "FAQPage"), "FAQPage present").toBe(true);

      // Links to at least one different related article.
      const relatedPrefix = lang === "uz" ? "/blog/" : `/${lang}/blog/`;
      const relatedHrefs = await page
        .locator(`main a[href^="${relatedPrefix}"]`)
        .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")));
      expect(
        relatedHrefs.some((h) => h !== null && !h.endsWith(post.slug)),
        "links to a different related article",
      ).toBe(true);

      // Reachable via a plain <a href> from its own locale's blog index.
      await page.goto(indexPath(lang));
      await expect(page.locator(`a[href="${path}"]`)).toHaveCount(1);
    });
  }
}

test.describe("SEO: site infrastructure", () => {
  test("sitemap.xml lists every article in all three locales; no admin/api", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    for (const post of POSTS) {
      for (const lang of LOCALES) {
        expect(xml, `${lang} ${post.slug}`).toContain(`${SITE}${postPath(lang, post.slug)}`);
      }
    }
    expect(xml).not.toContain("/admin");
    expect(xml).not.toContain("/api");
  });

  test("feed.xml is valid RSS and lists every article in all three locales", async ({ page }) => {
    const res = await page.request.get("/feed.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/rss+xml");
    const xml = await res.text();
    expect(xml).toContain("<rss");
    expect(xml).toContain('rel="self"');
    for (const post of POSTS) {
      for (const lang of LOCALES) {
        expect(xml).toContain(`${SITE}${postPath(lang, post.slug)}`);
      }
    }
  });

  test("robots.txt allows crawling and references the sitemap", async ({ page }) => {
    const res = await page.request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const txt = await res.text();
    expect(txt).toContain("Sitemap: https://birliy.uz/sitemap.xml");
    expect(txt).toContain("Allow: /");
    expect(txt).toContain("Disallow: /admin");
  });
});
