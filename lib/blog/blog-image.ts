import type { BlogImageSet } from "./types";

const SITE = "https://birliy.uz";

// Returns the three absolute cover-image URLs for a blog post slug.
// Images live in public/photos/blog/{slug}-{ratio}.jpg.
export function blogCover(slug: string): BlogImageSet {
  const base = `${SITE}/photos/blog/${slug}`;
  return {
    square: `${base}-1x1.jpg`,
    landscape: `${base}-4x3.jpg`,
    wide: `${base}-16x9.jpg`,
  };
}
