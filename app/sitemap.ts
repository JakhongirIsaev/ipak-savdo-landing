import type { MetadataRoute } from "next";

const languages = { uz: "https://birliy.uz", ru: "https://birliy.uz/ru" };

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://birliy.uz", changeFrequency: "weekly", priority: 1, alternates: { languages } },
    { url: "https://birliy.uz/ru", changeFrequency: "weekly", priority: 0.9, alternates: { languages } },
  ];
}
