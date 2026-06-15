import type { Metadata } from "next";
import type { BlogLocale, BlogPost } from "./types";
import { BLOG_UI, blogIndexPath, blogPostPath } from "./i18n";

const SITE = "https://birliy.uz";

// Shared social-share card for blog pages. Reuses the on-brand landing image
// until a dedicated 1200x630 blog card is produced.
const BLOG_OG_IMAGE = "/photos/owner-tablet.jpg";

const INDEX_KEYWORDS: Record<BlogLocale, string[]> = {
  uz: [
    "do'kon yuritish",
    "kassa dasturi maqolalar",
    "ombor hisobi qo'llanma",
    "savdo hisobi maslahatlar",
    "kichik biznes blog",
    "do'kon uchun maslahatlar",
    "BirLiy blog",
  ],
  ru: [
    "блог о малом бизнесе",
    "советы для магазина",
    "как вести магазин",
    "кассовая программа статьи",
    "складской учёт гид",
    "малый бизнес Узбекистан",
    "блог BirLiy",
  ],
  en: [
    "small business blog Uzbekistan",
    "shop management advice",
    "POS system articles",
    "inventory management guide",
    "retail tips Uzbekistan",
    "BirLiy blog",
  ],
};

function alternatesFor(paths: Record<BlogLocale, string>) {
  return {
    uz: `${SITE}${paths.uz}`,
    ru: `${SITE}${paths.ru}`,
    en: `${SITE}${paths.en}`,
    "x-default": `${SITE}${paths.uz}`,
  };
}

export function blogIndexMetadata(locale: BlogLocale): Metadata {
  const ui = BLOG_UI[locale];
  const languages = alternatesFor({
    uz: blogIndexPath("uz"),
    ru: blogIndexPath("ru"),
    en: blogIndexPath("en"),
  });
  const url = `${SITE}${blogIndexPath(locale)}`;
  return {
    title: ui.blogTitle,
    description: ui.blogDescription,
    keywords: INDEX_KEYWORDS[locale],
    alternates: { canonical: url, languages },
    openGraph: {
      title: ui.blogTitle,
      description: ui.blogDescription,
      type: "website",
      url,
      siteName: "BirLiy",
      locale: ui.ogLocale,
      images: [{ url: BLOG_OG_IMAGE, width: 1120, height: 840, alt: ui.blogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ui.blogTitle,
      description: ui.blogDescription,
      images: [BLOG_OG_IMAGE],
    },
  };
}

export function blogPostMetadata(post: BlogPost, locale: BlogLocale): Metadata {
  const ui = BLOG_UI[locale];
  const c = post.locales[locale];
  const languages = alternatesFor({
    uz: blogPostPath("uz", post.slug),
    ru: blogPostPath("ru", post.slug),
    en: blogPostPath("en", post.slug),
  });
  const url = `${SITE}${blogPostPath(locale, post.slug)}`;
  return {
    title: c.title,
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: url, languages },
    openGraph: {
      title: c.title,
      description: c.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified ?? post.date,
      url,
      siteName: "BirLiy",
      locale: ui.ogLocale,
      images: [{ url: BLOG_OG_IMAGE, width: 1120, height: 840, alt: c.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      images: [BLOG_OG_IMAGE],
    },
  };
}
