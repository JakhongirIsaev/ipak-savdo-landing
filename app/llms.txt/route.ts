import { POSTS } from "@/lib/blog";
import { blogPostPath } from "@/lib/blog/i18n";

// llms.txt: a plain-text site summary for AI agents and LLM crawlers,
// per the llmstxt.org convention. Static content, cache aggressively.

export const dynamic = "force-static";

const SITE = "https://birliy.uz";

export function GET(): Response {
  const posts = POSTS.map((p) => {
    const en = p.locales.en;
    return `- [${en.title}](${SITE}${blogPostPath("en", p.slug)}): ${en.description} (also in Uzbek: ${SITE}${blogPostPath("uz", p.slug)} and Russian: ${SITE}${blogPostPath("ru", p.slug)})`;
  }).join("\n");

  const body = `# BirLiy

> BirLiy is a phone-first POS (point of sale) app designed primarily for neighborhood shops and minimarkets in Uzbekistan. It combines checkout, inventory management, QR payments and owner reports in one phone or tablet app. Pricing: 49 000 som/month for the first 6 months, then 149 000 som/month.

Key facts:
- Primary customers: neighborhood shops and minimarkets in Uzbekistan.
- Starts on a phone or tablet; scanner and printer can be added later.
- Works offline; syncs automatically when the connection returns.
- Sends receipts to customers via Telegram instead of a paper printer.
- Product database with 9 000+ items: setup takes one day, the team helps load products.
- PIN access and a full action journal protect owners from cashier fraud.
- Languages: Uzbek (default), Russian. Site sections: https://birliy.uz (uz), https://birliy.uz/ru (ru).
- Status: early access, first pilot shops in Tashkent (2026).
- Contact: Telegram +998 97 421 24 54, lead form at https://birliy.uz/#lead
- Full machine-readable product and article text: https://birliy.uz/llms-full.txt

## Blog

${posts}

## Blog indexes

- [Uzbek](${SITE}/blog)
- [Russian](${SITE}/ru/blog)
- [English](${SITE}/en/blog)
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
