import { describe, it, expect } from "vitest";
import { landingPath, blogPostPath, blogCategoryPath, blogIndexPath, BLOG_UI } from "./i18n";
import { articleJsonLd } from "./article-jsonld";
import { blogPostMetadata, blogCategoryMetadata, blogIndexMetadata } from "./meta";
import type { BlogLocale, BlogLocaleContent, BlogPost } from "./types";

const SITE = "https://birliy.uz";
const LOCALES: BlogLocale[] = ["uz", "ru", "en"];

function content(tag: string): BlogLocaleContent {
  return {
    title: `Title ${tag}`,
    description: `Description ${tag}`,
    keywords: ["k1", "k2"],
    intro: ["intro"],
    sections: [{ h2: "H", paragraphs: ["b"] }],
    faq: [{ q: "Q?", a: "A." }],
    cta: { text: "cta", button: "btn" },
  };
}
const post: BlogPost = {
  slug: "seo-test",
  date: "2026-01-01",
  category: "product",
  locales: { uz: content("uz"), ru: content("ru"), en: content("en") },
};

const node = (locale: BlogLocale, type: string) =>
  (articleJsonLd(post, locale)["@graph"] as Array<Record<string, unknown>>).find((n) => n["@type"] === type)!;

describe("landingPath / EN breadcrumb home (must not point to /ru)", () => {
  it("maps uz->/, ru->/ru, en->/ (NOT /ru)", () => {
    expect(landingPath("uz")).toBe("/");
    expect(landingPath("ru")).toBe("/ru");
    expect(landingPath("en")).toBe("/");
  });

  it("EN article BreadcrumbList home item is the uz root, never the Russian home", () => {
    const crumb = node("en", "BreadcrumbList") as { itemListElement: Array<{ position: number; item?: string }> };
    const home = crumb.itemListElement.find((i) => i.position === 1)!;
    expect(home.item).toBe(`${SITE}/`);
    expect(home.item).not.toBe(`${SITE}/ru`);
  });

  it("RU article BreadcrumbList home item stays on /ru", () => {
    const crumb = node("ru", "BreadcrumbList") as { itemListElement: Array<{ position: number; item?: string }> };
    expect(crumb.itemListElement.find((i) => i.position === 1)!.item).toBe(`${SITE}/ru`);
  });
});

describe("hreflang reciprocity on post / category / index metadata", () => {
  const expectAlternates = (
    languages: Record<string, string> | undefined,
    paths: Record<BlogLocale, string>,
  ) => {
    expect(Object.keys(languages ?? {}).sort()).toEqual(["en", "ru", "uz", "x-default"]);
    expect(languages!.uz).toBe(`${SITE}${paths.uz}`);
    expect(languages!.ru).toBe(`${SITE}${paths.ru}`);
    expect(languages!.en).toBe(`${SITE}${paths.en}`);
    expect(languages!["x-default"]).toBe(`${SITE}${paths.uz}`);
  };

  it("post metadata carries uz/ru/en + x-default(uz) for every locale", () => {
    for (const locale of LOCALES) {
      const md = blogPostMetadata(post, locale);
      expectAlternates(md.alternates?.languages as Record<string, string>, {
        uz: blogPostPath("uz", post.slug),
        ru: blogPostPath("ru", post.slug),
        en: blogPostPath("en", post.slug),
      });
    }
  });

  it("category metadata carries uz/ru/en + x-default(uz)", () => {
    for (const locale of LOCALES) {
      const md = blogCategoryMetadata(locale, "product");
      expectAlternates(md.alternates?.languages as Record<string, string>, {
        uz: blogCategoryPath("uz", "product"),
        ru: blogCategoryPath("ru", "product"),
        en: blogCategoryPath("en", "product"),
      });
    }
  });

  it("blog index metadata carries uz/ru/en + x-default(uz)", () => {
    for (const locale of LOCALES) {
      const md = blogIndexMetadata(locale);
      expectAlternates(md.alternates?.languages as Record<string, string>, {
        uz: blogIndexPath("uz"),
        ru: blogIndexPath("ru"),
        en: blogIndexPath("en"),
      });
    }
  });
});

describe("language signals (html lang testable surface)", () => {
  it("BLOG_UI.htmlLang equals the locale for uz/ru/en", () => {
    for (const locale of LOCALES) expect(BLOG_UI[locale].htmlLang).toBe(locale);
  });

  it("BlogPosting inLanguage and og:locale match the locale", () => {
    const ogLocale: Record<BlogLocale, string> = { uz: "uz_UZ", ru: "ru_RU", en: "en_US" };
    for (const locale of LOCALES) {
      expect((node(locale, "BlogPosting") as { inLanguage: string }).inLanguage).toBe(locale);
      expect(blogPostMetadata(post, locale).openGraph?.locale).toBe(ogLocale[locale]);
    }
  });
});

describe("OG image dimensions are landscape on index and category", () => {
  it("index + category OG images declare width > height", () => {
    const idx = (blogIndexMetadata("ru").openGraph?.images as Array<{ width: number; height: number }>)[0];
    const cat = (blogCategoryMetadata("ru", "product").openGraph?.images as Array<{ width: number; height: number }>)[0];
    expect(idx.width).toBeGreaterThan(idx.height);
    expect(cat.width).toBeGreaterThan(cat.height);
  });
});
