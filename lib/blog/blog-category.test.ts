import { describe, it, expect } from "vitest";
import { POSTS, BLOG_CATEGORIES, postCategory, postsByCategory } from "./index";
import type { BlogCategory } from "./types";
import { CATEGORY_LABEL, blogCategoryPath } from "./i18n";
import { blogCategoryMetadata } from "./meta";

const SITE = "https://birliy.uz";
const LOCALES = ["uz", "ru", "en"] as const;

describe("postCategory", () => {
  it("returns 'product' for a post with no category field (default)", () => {
    const bare = { ...POSTS[0], category: undefined };
    expect(postCategory(bare)).toBe("product");
  });

  it("returns the post's explicit category when set", () => {
    const p = { ...POSTS[0], category: "ai-tech" as BlogCategory };
    expect(postCategory(p)).toBe("ai-tech");
  });
});

describe("postsByCategory", () => {
  it("returns all 4 existing posts for 'product' (all posts have category: product)", () => {
    expect(postsByCategory("product")).toHaveLength(4);
  });

  it("returns 0 posts for 'ai-tech' (no articles assigned yet)", () => {
    expect(postsByCategory("ai-tech")).toHaveLength(0);
  });

  it("returns 0 posts for 'football' (no articles assigned yet)", () => {
    expect(postsByCategory("football")).toHaveLength(0);
  });
});

describe("CATEGORY_LABEL", () => {
  it("has a non-empty label for every category in every locale", () => {
    for (const category of BLOG_CATEGORIES) {
      for (const locale of LOCALES) {
        const label = CATEGORY_LABEL[category][locale];
        expect(label, `${category}/${locale}`).toBeTruthy();
        expect(label.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("blogCategoryPath", () => {
  it("uz category paths have no locale prefix", () => {
    for (const category of BLOG_CATEGORIES) {
      const path = blogCategoryPath("uz", category as BlogCategory);
      expect(path).toBe(`/blog/category/${category}`);
    }
  });

  it("ru category paths start with /ru", () => {
    for (const category of BLOG_CATEGORIES) {
      const path = blogCategoryPath("ru", category as BlogCategory);
      expect(path).toBe(`/ru/blog/category/${category}`);
    }
  });

  it("en category paths start with /en", () => {
    for (const category of BLOG_CATEGORIES) {
      const path = blogCategoryPath("en", category as BlogCategory);
      expect(path).toBe(`/en/blog/category/${category}`);
    }
  });
});

describe("blogCategoryMetadata", () => {
  it("canonical URL matches the locale's blogCategoryPath", () => {
    for (const category of BLOG_CATEGORIES) {
      for (const locale of LOCALES) {
        const meta = blogCategoryMetadata(locale, category as BlogCategory);
        expect(meta.alternates?.canonical).toBe(`${SITE}${blogCategoryPath(locale, category as BlogCategory)}`);
      }
    }
  });

  it("hreflang languages object has uz, ru, en, x-default keys", () => {
    for (const category of BLOG_CATEGORIES) {
      for (const locale of LOCALES) {
        const meta = blogCategoryMetadata(locale, category as BlogCategory);
        const langs = meta.alternates?.languages ?? {};
        expect(Object.keys(langs).sort()).toEqual(["en", "ru", "uz", "x-default"]);
      }
    }
  });

  it("x-default hreflang points to the uz canonical URL", () => {
    for (const category of BLOG_CATEGORIES) {
      const meta = blogCategoryMetadata("ru", category as BlogCategory);
      const langs = meta.alternates?.languages as Record<string, string>;
      expect(langs["x-default"]).toBe(`${SITE}${blogCategoryPath("uz", category as BlogCategory)}`);
    }
  });
});

describe("blogCategoryMetadata robots (empty-category SEO)", () => {
  it("marks an EMPTY category (no posts) as noindex in every locale", () => {
    for (const category of ["ai-tech", "football"] as const) {
      expect(postsByCategory(category)).toHaveLength(0); // precondition: empty
      for (const locale of LOCALES) {
        const meta = blogCategoryMetadata(locale, category);
        const robots = meta.robots as { index?: boolean } | undefined;
        expect(robots?.index, `${category}/${locale}`).toBe(false);
      }
    }
  });

  it("keeps the 'product' category (has posts) indexable", () => {
    expect(postsByCategory("product").length).toBeGreaterThan(0); // precondition: non-empty
    for (const locale of LOCALES) {
      const meta = blogCategoryMetadata(locale, "product");
      const robots = meta.robots as { index?: boolean } | undefined;
      expect(robots?.index, locale).not.toBe(false);
    }
  });
});
