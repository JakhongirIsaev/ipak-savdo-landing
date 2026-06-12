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

export interface BlogLocaleContent {
  title: string;
  description: string;
  keywords: string[];
  intro: string[];
  sections: BlogSection[];
  faq: BlogFaqItem[];
  cta: { text: string; button: string };
}

export interface BlogPost {
  slug: string;
  date: string; // YYYY-MM-DD, used in JSON-LD datePublished
  locales: Record<BlogLocale, BlogLocaleContent>;
}
