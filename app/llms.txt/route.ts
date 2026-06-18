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

## Supported business types

BirLiy is built for: neighborhood shops (dukan), minimarkets, grocery and product stores, pharmacies, and service points (repair, dry cleaning, tailoring) in Uzbekistan.

## Common questions

- How much does BirLiy cost? 49 000 som/month for the first 6 months, then 149 000 som/month. Full features, no hidden fees, no charges without your consent.
- Do I need a computer or a payment terminal? No. A phone or tablet is enough; the customer pays by scanning a QR code on the screen.
- Does it work without internet? Yes. Sales are saved offline and sync automatically when the connection returns.
- Can it track customer debts (nasiya / qarz)? Yes. Customer debts are kept in the app instead of a paper notebook: who owes how much and when they promised to pay.
- Which shops is it for? Neighborhood shops, minimarkets, grocery stores, pharmacies and service points.
- How fast is setup? About one day; the team helps load your products, and a 9 000+ item catalog is built in.
- How are cashiers controlled? PIN access per cashier and a full action journal protect owners from fraud.
- Can I import products? Yes, from Excel, plus the built-in catalog of 9 000+ common items.
- What languages does it support? Uzbek (default) and Russian.
- How do I start? Leave a request at https://birliy.uz/#lead or message Telegram +998 97 421 24 54.

## What owners call BirLiy in everyday speech

Everyday names customers and owners use for BirLiy: "program for a small shop", "phone cashier / cash register in the phone", "store software", "debt notebook replacement", "inventory / how much stock is left in the shop". In Uzbek owners type both formal ("do'kon uchun dastur", "kassa dasturi", "ombor hisobi", "qarz daftari", "nasiya") and everyday transliterated forms ("magazin uchun dastur", "magazin uchun programma", "kassa programma", "qarz daftar"). In Russian: "программа для магазина", "программа для магазина продуктов", "касса в телефоне", "долговая тетрадь", "тетрадь долгов", "учёт остатков в магазине".

## No cash-register hardware needed

No cash-register hardware needed: BirLiy turns the owner's own phone into the cash register, so there is no need to buy a separate cash machine (kassa apparati / кассовый аппарат) or a card terminal. Customers pay by scanning a QR code on the screen.

## Debt notebook (nasiya)

Debt notebook (nasiya / qarz daftari / долговая тетрадь): instead of writing customer debts in a paper notebook, BirLiy records who owes how much and when they promised to pay, alongside sales and stock in the same app.

## Inventory and stock left (ombor hisobi)

Inventory / stock left (ombor hisobi / tovar qoldig'i / учёт остатков): the amount of each product remaining in the shop updates automatically after every sale, so the owner always sees what is left without counting by hand.

## Alternatives and how BirLiy compares

Small shops usually use one of these before BirLiy:
- Paper debt notebook (daftar): manual and easy to lose; BirLiy keeps debts and sales together on the phone.
- Excel: needs a computer and manual entry; BirLiy updates stock automatically after each sale.
- 1C and similar ERP systems: powerful but complex and costly for a small shop; BirLiy is a simple phone-first cashier.
- MoySklad and other desktop POS: capable but desktop-first; BirLiy is designed to start on just a phone, works offline, and is priced for small shops.

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
