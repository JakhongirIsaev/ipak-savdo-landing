import type { Metadata } from "next";
import type { BlogLocale, BlogPost, BlogCategory } from "./types";
import { BLOG_UI, blogIndexPath, blogPostPath, blogCategoryPath, CATEGORY_LABEL } from "./i18n";
import { postsByCategory } from "./index";

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
    alternates: {
      canonical: url,
      languages,
      types: { "application/rss+xml": `${SITE}/feed.xml` },
    },
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

export function blogCategoryMetadata(locale: BlogLocale, category: BlogCategory): Metadata {
  const ui = BLOG_UI[locale];
  const label = CATEGORY_LABEL[category][locale];
  const title = ui.categoryTitle(label);
  const description = ui.categoryDescription(label);
  const languages = alternatesFor({
    uz: blogCategoryPath("uz", category),
    ru: blogCategoryPath("ru", category),
    en: blogCategoryPath("en", category),
  });
  const url = `${SITE}${blogCategoryPath(locale, category)}`;
  // An empty category (no posts yet) is a thin page: mark it noindex so Google
  // does not index a contentless page. Keep `follow` so links stay crawlable.
  const robots =
    postsByCategory(category).length === 0 ? { index: false, follow: true } : undefined;
  return {
    title,
    description,
    robots,
    alternates: {
      canonical: url,
      languages,
      types: { "application/rss+xml": `${SITE}/feed.xml` },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "BirLiy",
      locale: ui.ogLocale,
      images: [{ url: BLOG_OG_IMAGE, width: 1120, height: 840, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  // Use the article's own 16:9 image as the social card when present; otherwise
  // fall back to the shared blog image.
  const ogImage = post.image
    ? { url: post.image.wide, width: 1200, height: 675 }
    : { url: BLOG_OG_IMAGE, width: 1120, height: 840 };
  return {
    title: c.title,
    description: c.description,
    keywords: c.keywords,
    alternates: {
      canonical: url,
      languages,
      types: { "application/rss+xml": `${SITE}/feed.xml` },
    },
    openGraph: {
      title: c.title,
      description: c.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified ?? post.date,
      url,
      siteName: "BirLiy",
      locale: ui.ogLocale,
      images: [{ ...ogImage, alt: c.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      images: [ogImage.url],
    },
  };
}
