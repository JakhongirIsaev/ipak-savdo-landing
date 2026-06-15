import { POSTS } from "@/lib/blog";
import { blogPostPath } from "@/lib/blog/i18n";
import type { BlogLocale } from "@/lib/blog/types";

export const dynamic = "force-static";

const SITE = "https://birliy.uz";
const LOCALES: BlogLocale[] = ["uz", "ru", "en"];

function renderPost(locale: BlogLocale, slug: string): string {
  const post = POSTS.find((item) => item.slug === slug);
  if (!post) return "";
  const content = post.locales[locale];
  const sections = content.sections
    .map((section) => {
      const list = section.list?.map((item) => `- ${item}`).join("\n") ?? "";
      return `## ${section.h2}\n\n${section.paragraphs.join("\n\n")}${list ? `\n\n${list}` : ""}`;
    })
    .join("\n\n");
  const faq = content.faq.map((item) => `Q: ${item.q}\nA: ${item.a}`).join("\n\n");
  const sources = content.sources?.map((source) => `- ${source.label}: ${source.url}`).join("\n") ?? "";

  return `# ${content.title}

URL: ${SITE}${blogPostPath(locale, post.slug)}
Published: ${post.date}
Modified: ${post.modified ?? post.date}
Description: ${content.description}

${content.intro.join("\n\n")}

${sections}

## FAQ

${faq}
${sources ? `\n\n## Sources\n\n${sources}` : ""}
`;
}

export function GET(): Response {
  const articles = LOCALES.flatMap((locale) => POSTS.map((post) => renderPost(locale, post.slug))).join("\n\n---\n\n");

  const body = `# BirLiy: full product and content reference

Canonical website: ${SITE}

BirLiy is a phone-first POS system for neighborhood shops and minimarkets in Uzbekistan. It combines checkout, inventory, QR payments, debt records, cashier roles and owner reports in one phone or tablet app.

Product facts:
- Primary customer: neighborhood shop or minimarket owner in Uzbekistan.
- Device: starts on a phone or tablet; optional hardware can be added later.
- Price: 49 000 som/month for the first 6 months, then 149 000 som/month.
- Setup: the team helps configure the shop, initial catalog and cashier workflow in one working day.
- Catalog: 9 000+ common products plus Excel import.
- Operation: offline sales with synchronization when connectivity returns.
- Control: cashier PIN roles and an action journal.
- Languages: Uzbek and Russian product pages; Uzbek, Russian and English blog articles.
- Contact: https://birliy.uz/#lead and Telegram +998 97 421 24 54.

The following articles are the complete public BirLiy blog corpus:

${articles}`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
