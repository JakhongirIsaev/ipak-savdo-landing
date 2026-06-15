import { test, expect, type Page } from "@playwright/test";

// ──────────────────────────────────────────────────────────────
// SEO / indexability verification for the flagship blog article in
// all three languages, plus sitemap / feed / robots. Checks the
// signals Google needs to discover, crawl, understand and index a
// page (no ranking assertions).
// ──────────────────────────────────────────────────────────────

const SITE = "https://birliy.uz";
const SLUG = "pos-tizimi-uzbekistan-minimarket";

const LOCALES = [
  { lang: "uz", path: `/blog/${SLUG}` },
  { lang: "ru", path: `/ru/blog/${SLUG}` },
  { lang: "en", path: `/en/blog/${SLUG}` },
] as const;

const canonicalOf = (path: string) => `${SITE}${path}`;
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

for (const { lang, path } of LOCALES) {
  test.describe(`SEO: flagship article (${lang})`, () => {
    test(`${path}: 200, indexable, canonical, one H1, title`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);

      // Indexable: no noindex meta.
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);

      // Self-referencing canonical.
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonicalOf(path));

      // Exactly one H1, non-empty.
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.locator("h1").innerText()).trim().length).toBeGreaterThan(0);

      // Title present and non-trivial.
      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);

      // Meta description present.
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
    });

    test(`${path}: reciprocal hreflang (uz/ru/en/x-default)`, async ({ page }) => {
      await page.goto(path);
      const alt = altOf(SLUG);
      for (const hl of ["uz", "ru", "en", "x-default"] as const) {
        await expect(page.locator(`link[hreflang="${hl}"]`)).toHaveAttribute("href", alt[hl]);
      }
    });

    test(`${path}: BlogPosting JSON-LD is complete`, async ({ page }) => {
      await page.goto(path);
      const nodes = await jsonLdGraph(page);
      const article = nodes.find((n) => n["@type"] === "BlogPosting");
      expect(article, "BlogPosting node present").toBeTruthy();

      expect(article.headline?.length).toBeGreaterThan(0);
      expect(article.description?.length).toBeGreaterThan(0);
      expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(article.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(article.inLanguage).toBe(lang);
      expect(article.mainEntityOfPage).toBe(canonicalOf(path));
      // Absolute image URL.
      const imageUrl = typeof article.image === "string" ? article.image : article.image?.url;
      expect(imageUrl).toMatch(/^https:\/\/birliy\.uz\//);
      // Publisher = BirLiy Organization with a logo.
      expect(article.publisher?.name).toBe("BirLiy");
      expect(article.publisher?.logo?.url).toContain("birliy-wordmark");
      expect(article.author?.name).toBe("BirLiy");

      // Breadcrumb + FAQ present (they reflect visible content).
      expect(nodes.some((n) => n["@type"] === "BreadcrumbList")).toBe(true);
      expect(nodes.some((n) => n["@type"] === "FAQPage")).toBe(true);
    });

    test(`${path}: og:image absolute + rss feed link in head`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/birliy\.uz\//);
      await expect(page.locator('link[type="application/rss+xml"]')).toHaveAttribute("href", `${SITE}/feed.xml`);
    });

    test(`${path}: article is reachable via an <a href> from its locale blog index`, async ({ page }) => {
      const indexPath = lang === "uz" ? "/blog" : `/${lang}/blog`;
      await page.goto(indexPath);
      await expect(page.locator(`a[href="${path}"]`)).toHaveCount(1);
    });

    test(`${path}: article links to related articles`, async ({ page }) => {
      await page.goto(path);
      const related = page.locator(`main a[href^="${lang === "uz" ? "/blog/" : `/${lang}/blog/`}"]`);
      // At least one related-article link to a different post.
      const hrefs = await related.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")));
      expect(hrefs.some((h) => h && !h.endsWith(SLUG))).toBe(true);
    });
  });
}

test.describe("SEO: site infrastructure", () => {
  test("sitemap.xml lists the flagship in all three locales with no admin/api URLs", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    for (const { path } of LOCALES) expect(xml).toContain(canonicalOf(path));
    expect(xml).not.toContain("/admin");
    expect(xml).not.toContain("/api");
  });

  test("feed.xml is valid RSS and lists the flagship in all three locales", async ({ page }) => {
    const res = await page.request.get("/feed.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/rss+xml");
    const xml = await res.text();
    expect(xml).toContain("<rss");
    expect(xml).toContain("rel=\"self\"");
    for (const { path } of LOCALES) expect(xml).toContain(canonicalOf(path));
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
