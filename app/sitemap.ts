import type { MetadataRoute } from "next";
import { POSTS, BLOG_CATEGORIES, postsByCategory } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog/types";
import type { BlogCategory } from "@/lib/blog/types";
import { blogIndexPath, blogPostPath, blogCategoryPath } from "@/lib/blog/i18n";
import { SEO_KEYWORD_LAST_MODIFIED, SEO_KEYWORD_PAGES } from "@/lib/seo/keyword-pages";

const SITE = "https://birliy.uz";
const landingLanguages = { uz: SITE, ru: `${SITE}/ru`, "x-default": SITE };

// Last meaningful change to the landing copy. Bump this ONLY when the landing
// content actually changes, not on every deploy, so crawlers are never told a
// page changed when it did not (a fresh `new Date()` here would do exactly that).
const LANDING_MODIFIED = "2026-06-15";

// Each article reports its genuine last-modified date (publish date if never edited).
function postModified(post: Pick<BlogPost, "date" | "modified">): string {
  return post.modified ?? post.date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["uz", "ru", "en"] as const;

  // The blog index freshness tracks the newest genuine article change.
  const latestBlogDate = POSTS.reduce(
    (max, post) => (postModified(post) > max ? postModified(post) : max),
    "0000-00-00",
  );

  const entries: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: LANDING_MODIFIED, changeFrequency: "weekly", priority: 1, alternates: { languages: landingLanguages } },
    { url: `${SITE}/ru`, lastModified: LANDING_MODIFIED, changeFrequency: "weekly", priority: 0.9, alternates: { languages: landingLanguages } },
  ];

  for (const locale of locales) {
    const languages = {
      uz: `${SITE}${blogIndexPath("uz")}`,
      ru: `${SITE}${blogIndexPath("ru")}`,
      en: `${SITE}${blogIndexPath("en")}`,
      "x-default": `${SITE}${blogIndexPath("uz")}`,
    };
    entries.push({
      url: `${SITE}${blogIndexPath(locale)}`,
      lastModified: latestBlogDate,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages },
    });
  }

  for (const post of POSTS) {
    const languages = {
      uz: `${SITE}${blogPostPath("uz", post.slug)}`,
      ru: `${SITE}${blogPostPath("ru", post.slug)}`,
      en: `${SITE}${blogPostPath("en", post.slug)}`,
      "x-default": `${SITE}${blogPostPath("uz", post.slug)}`,
    };
    for (const locale of locales) {
      entries.push({
        url: `${SITE}${blogPostPath(locale, post.slug)}`,
        lastModified: postModified(post),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  for (const category of BLOG_CATEGORIES) {
    // Only list categories that have posts. An empty category renders a thin
    // noindex page (lib/blog/meta.ts), so it must not appear in the sitemap.
    if (postsByCategory(category as BlogCategory).length === 0) continue;
    const languages = {
      uz: `${SITE}${blogCategoryPath("uz", category as BlogCategory)}`,
      ru: `${SITE}${blogCategoryPath("ru", category as BlogCategory)}`,
      en: `${SITE}${blogCategoryPath("en", category as BlogCategory)}`,
      "x-default": `${SITE}${blogCategoryPath("uz", category as BlogCategory)}`,
    };
    for (const locale of locales) {
      entries.push({
        url: `${SITE}${blogCategoryPath(locale, category as BlogCategory)}`,
        lastModified: latestBlogDate,
        changeFrequency: "weekly",
        priority: 0.65,
        alternates: { languages },
      });
    }
  }

  for (const page of SEO_KEYWORD_PAGES) {
    entries.push({
      url: `${SITE}${page.path}`,
      lastModified: SEO_KEYWORD_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  return entries;
}
