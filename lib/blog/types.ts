// Blog content model. Each post ships all three locales together so the
// routes can guarantee hreflang alternates always resolve.

export type BlogLocale = "uz" | "ru" | "en";

export type BlogCategory = "product" | "ai-tech";

export interface BlogSection {
  h2: string;
  paragraphs: string[];
  list?: string[];
}

export interface BlogFaqItem {
  q: string;
  a: string;
}

export interface BlogSource {
  label: string;
  url: string;
}

// Article-specific images as ABSOLUTE URLs. Provide all three aspect ratios for
// the best Google Article rich-result coverage; `wide` (16:9) is also the Open
// Graph / social card image. Until real assets exist, posts omit this and fall
// back to the shared blog image (see lib/blog/meta.ts and components/blog).
export interface BlogImageSet {
  square: string; // 1:1, recommended 1200x1200
  landscape: string; // 4:3, recommended 1200x900
  wide: string; // 16:9, recommended 1200x675 (primary social image)
}

export interface BlogLocaleContent {
  title: string;
  description: string;
  keywords: string[];
  intro: string[];
  sections: BlogSection[];
  faq: BlogFaqItem[];
  sources?: BlogSource[];
  cta: { text: string; button: string };
}

export interface BlogPost {
  slug: string;
  date: string; // YYYY-MM-DD, used in JSON-LD datePublished
  modified?: string;
  image?: BlogImageSet;
  category?: BlogCategory;
  locales: Record<BlogLocale, BlogLocaleContent>;
}
