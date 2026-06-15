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

  it("falls back to the shared image when image is absent", () => {
    expect(blogPosting(withoutImage, "ru").image).toBe(`${SITE}/photos/owner-tablet.jpg`);
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

  it("retains the fallback image (1120x840) when image is absent", () => {
    const md = blogPostMetadata(withoutImage, "ru");
    expect(md.openGraph?.images).toEqual([{ url: "/photos/owner-tablet.jpg", width: 1120, height: 840, alt: "Title ru" }]);
    expect((md.twitter as { images?: unknown })?.images).toEqual(["/photos/owner-tablet.jpg"]);
  });
});
