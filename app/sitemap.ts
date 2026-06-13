import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";
import { blogIndexPath, blogPostPath } from "@/lib/blog/i18n";

const SITE = "https://birliy.uz";
const landingLanguages = { uz: SITE, ru: `${SITE}/ru`, "x-default": SITE };

export default function sitemap(): MetadataRoute.Sitemap {
  // Stamped at build time: every deploy bumps the landing dates, which nudges
  // crawlers to refresh the cached snippet and thumbnail.
  const deployedAt = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: deployedAt, changeFrequency: "weekly", priority: 1, alternates: { languages: landingLanguages } },
    { url: `${SITE}/ru`, lastModified: deployedAt, changeFrequency: "weekly", priority: 0.9, alternates: { languages: landingLanguages } },
  ];

  const locales = ["uz", "ru", "en"] as const;

  for (const locale of locales) {
    const languages = {
      uz: `${SITE}${blogIndexPath("uz")}`,
      ru: `${SITE}${blogIndexPath("ru")}`,
      en: `${SITE}${blogIndexPath("en")}`,
      "x-default": `${SITE}${blogIndexPath("uz")}`,
    };
    entries.push({
      url: `${SITE}${blogIndexPath(locale)}`,
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
        lastModified: post.date,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
