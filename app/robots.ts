import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const publicRules = { allow: "/", disallow: ["/admin", "/api"] };
  return {
    rules: [
      { userAgent: ["OAI-SearchBot", "ChatGPT-User", "GPTBot"], ...publicRules },
      { userAgent: ["Claude-SearchBot", "Claude-User", "ClaudeBot"], ...publicRules },
      { userAgent: ["PerplexityBot", "Perplexity-User"], ...publicRules },
      { userAgent: "Google-Extended", ...publicRules },
      { userAgent: "*", ...publicRules },
    ],
    sitemap: "https://birliy.uz/sitemap.xml",
  };
}
