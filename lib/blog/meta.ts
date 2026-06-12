import type { Metadata } from "next";
import type { BlogLocale, BlogPost } from "./types";
import { BLOG_UI, blogIndexPath, blogPostPath } from "./i18n";

const SITE = "https://birliy.uz";

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
    alternates: { canonical: url, languages },
    openGraph: {
      title: ui.blogTitle,
      description: ui.blogDescription,
      type: "website",
      url,
      siteName: "BirLiy",
      locale: ui.ogLocale,
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
      url,
      siteName: "BirLiy",
      locale: ui.ogLocale,
    },
    twitter: { card: "summary", title: c.title, description: c.description },
  };
}
