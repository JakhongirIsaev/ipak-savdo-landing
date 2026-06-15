// Blog content model. Each post ships all three locales together so the
// routes can guarantee hreflang alternates always resolve.

export type BlogLocale = "uz" | "ru" | "en";

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
  locales: Record<BlogLocale, BlogLocaleContent>;
}
