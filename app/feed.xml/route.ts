import { POSTS } from "@/lib/blog";
import { blogPostPath } from "@/lib/blog/i18n";
import type { BlogLocale } from "@/lib/blog/types";

// Static RSS feed: content is fully known at build time.
export const dynamic = "force-static";

const SITE = "https://birliy.uz";
const LOCALES: BlogLocale[] = ["uz", "ru", "en"];

// "YYYY-MM-DD" -> RFC 822 date. Deterministic from the post date (no build-time clock).
function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET(): Response {
  const items = POSTS.flatMap((post) =>
    LOCALES.map((locale) => {
      const c = post.locales[locale];
      const url = `${SITE}${blogPostPath(locale, post.slug)}`;
      return [
        "    <item>",
        `      <title>${esc(c.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${esc(c.description)}</description>`,
        `      <pubDate>${rfc822(post.modified ?? post.date)}</pubDate>`,
        `      <dc:language>${locale}</dc:language>`,
        "    </item>",
      ].join("\n");
    }),
  );

  const latest = POSTS.reduce(
    (max, post) => ((post.modified ?? post.date) > max ? post.modified ?? post.date : max),
    "0000-00-00",
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>BirLiy blog</title>
    <link>${SITE}/blog</link>
    <description>Kassa, ombor, QR to'lov va do'kon boshqaruvi haqida amaliy maqolalar. Uzbek, Russian va English.</description>
    <language>uz</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
