import { describe, it, expect } from "vitest";
import { articleJsonLd } from "./article-jsonld";
import { blogPostMetadata } from "./meta";
import type { BlogLocaleContent, BlogPost } from "./types";

const SITE = "https://birliy.uz";

function content(tag: string): BlogLocaleContent {
  return {
    title: `Title ${tag}`,
    description: `Description ${tag}`,
    keywords: ["k1", "k2"],
    intro: ["intro paragraph"],
    sections: [{ h2: "Heading", paragraphs: ["body"] }],
    faq: [{ q: "Question?", a: "Answer." }],
    cta: { text: "cta text", button: "cta button" },
  };
}

const locales = { uz: content("uz"), ru: content("ru"), en: content("en") };

const IMAGES = {
  square: `${SITE}/photos/blog/synthetic-test-1x1.jpg`,
  landscape: `${SITE}/photos/blog/synthetic-test-4x3.jpg`,
  wide: `${SITE}/photos/blog/synthetic-test-16x9.jpg`,
};

const withImage: BlogPost = { slug: "synthetic-test", date: "2026-01-01", modified: "2026-01-02", image: IMAGES, locales };
const withoutImage: BlogPost = { slug: "synthetic-test", date: "2026-01-01", locales };

const blogPosting = (post: BlogPost, locale: "uz" | "ru" | "en") =>
  (articleJsonLd(post, locale)["@graph"] as Array<Record<string, unknown>>).find((n) => n["@type"] === "BlogPosting")!;

describe("BlogPost.image -> BlogPosting JSON-LD", () => {
  it("emits exactly the three image URLs (1:1, 4:3, 16:9) when image is set", () => {
    expect(blogPosting(withImage, "ru").image).toEqual([IMAGES.square, IMAGES.landscape, IMAGES.wide]);
  });

  it("falls back to the shared landscape image when image is absent", () => {
    expect(blogPosting(withoutImage, "ru").image).toBe(`${SITE}/photos/blog/birliy-og.jpg`);
  });
});

describe("BlogPost.image -> Open Graph + Twitter metadata", () => {
  it("Open Graph uses image.wide at 1200x675 when image is set", () => {
    const md = blogPostMetadata(withImage, "ru");
    expect(md.openGraph?.images).toEqual([{ url: IMAGES.wide, width: 1200, height: 675, alt: "Title ru" }]);
  });

  it("Twitter uses image.wide when image is set", () => {
    const md = blogPostMetadata(withImage, "ru");
    expect((md.twitter as { images?: unknown })?.images).toEqual([IMAGES.wide]);
  });

  it("falls back to a LANDSCAPE 1200x630 social card (not a portrait) when image is absent", () => {
    const md = blogPostMetadata(withoutImage, "ru");
    expect(md.openGraph?.images).toEqual([{ url: "/photos/blog/birliy-og.jpg", width: 1200, height: 630, alt: "Title ru" }]);
    expect((md.twitter as { images?: unknown })?.images).toEqual(["/photos/blog/birliy-og.jpg"]);
  });

  it("declared OG dimensions are landscape (width > height) in both the image and fallback paths", () => {
    for (const post of [withImage, withoutImage]) {
      const img = (blogPostMetadata(post, "ru").openGraph?.images as Array<{ width: number; height: number }>)[0];
      expect(img.width, post.slug).toBeGreaterThan(img.height);
    }
  });
});
