import { dicts } from "@/lib/landing/i18n";

type Locale = keyof typeof dicts;

const SITE = "https://birliy.uz";

// Machine-readable product descriptions (JSON-LD only — never shown to users).
// These carry the broader search-intent vocabulary (ERP / biznes dasturi / POS /
// ombor boshqaruvi) that the visible landing copy intentionally does not use.
const APP_DESCRIPTION: Record<Locale, string> = {
  uz: "BirLiy: O'zbekistondagi uy yonidagi do'kon, minimarket va oziq-ovqat do'koni uchun telefonda ishlaydigan POS dasturi. Magazin uchun dastur: kassa, ombor hisobi va tovar qoldig'i, qarz daftari (nasiya), QR to'lov va hisobotlar bitta ilovada. Boshlash uchun alohida uskuna sotib olish shart emas, internetsiz ham ishlaydi.",
  ru: "BirLiy: POS-система в телефоне для магазинов у дома, минимаркетов и продуктовых магазинов Узбекистана. Программа для магазина: касса, складской учёт остатков, долговая тетрадь (насия), QR-оплата и отчёты в одном приложении. Начать можно без отдельного оборудования, работает без интернета.",
};

const APP_KEYWORDS: Record<Locale, string> = {
  uz: "kassa dasturi, savdo dasturi, savdo avtomatlashtirish, ombor dasturi, ombor boshqaruvi, tovar qoldig'i, tovar hisobi, ERP tizimi, ERP dasturi, biznes dasturi, biznes avtomatlashtirish, POS terminal, POS dasturi, savdo nuqtasi, QR to'lov, do'kon uchun kassa, minimarket dasturi, dorixona dasturi, do'kon uchun dastur, telefonda kassa, mobil kassa dasturi, internetsiz ishlaydigan kassa dasturi, nasiya daftar dasturi, qarz hisobi dasturi, nasiya mijozlar hisobi, kichik do'kon uchun kassa dasturi, oziq-ovqat do'koni uchun kassa dasturi, terminalsiz QR to'lov, bepul kassa dasturi, BirLiy narxi, Toshkentda kassa dasturi, dukan uchun telefon kassa, magazin uchun dastur, magazin uchun programma, kassa programma, qarz daftar, nasiya daftar, ombor hisobi, do'konda ombor hisobini yuritish, telefon orqali kassa, kassa apparat kerakmi, kassa aparatsiz savdo, do'konda nima qolganini bilish, tovar sanash",
  ru: "касса для магазина, POS система, POS терминал, торговая точка, ERP система, ERP для бизнеса, бизнес-программа, автоматизация магазина, автоматизация торговли, складской учёт, управление складом, учёт товаров, учёт остатков, QR оплата, программа для магазина, программа для аптеки, касса на телефоне, мобильная касса, кассовое приложение для Android, учёт долгов покупателей, замена тетради долгов, насия, касса без интернета, программа для минимаркета, программа для дукана, QR оплата без терминала, бюджетная касса для магазина, сколько стоит BirLiy, касса Ташкент, программа для ИП Узбекистан, программа для магазина продуктов, программа для магазина у дома, касса для магазина продуктов, мобильная касса приложение, долговая тетрадь, долговая тетрадь в магазине, тетрадь долгов, учёт остатков в магазине, складской учёт для малого бизнеса, учёт долгов в магазине, касса для магазина цена, контроль остатков товаров",
};

// Machine-readable feature list (SoftwareApplication.featureList) — helps LLMs
// extract what BirLiy does. Mirrors the visible feature/capability sections.
const FEATURE_LIST: Record<Locale, string[]> = {
  uz: [
    "Kassa (sotuv)",
    "Ombor va tovar qoldig'i",
    "QR to'lov",
    "Nasiya va qarzlar hisobi",
    "Hisobotlar",
    "Telegram chek",
    "Internetsiz rejim",
    "Kassir PIN va nazorat",
    "Ko'p do'kon hisoboti",
    "9000+ tovar katalogi",
  ],
  ru: [
    "Касса (продажи)",
    "Склад и остатки товаров",
    "QR-оплата",
    "Учёт долгов покупателей (насия)",
    "Отчёты",
    "Чек в Telegram",
    "Офлайн-режим",
    "PIN кассира и контроль",
    "Отчёты по нескольким магазинам",
    "Каталог 9000+ товаров",
  ],
};

// The everyday alternatives shop owners weigh BirLiy against. Exposed as
// isRelatedTo so AI assistants answering "что поставить вместо тетради / 1С"
// can resolve BirLiy as the option.
const RELATED_ALTERNATIVES: Record<Locale, Array<{ "@type": string; name: string }>> = {
  uz: [
    { "@type": "Thing", name: "Qarz daftari (qog'oz)" },
    { "@type": "Thing", name: "Excel" },
    { "@type": "SoftwareApplication", name: "1C" },
  ],
  ru: [
    { "@type": "Thing", name: "Долговая тетрадь (бумага)" },
    { "@type": "Thing", name: "Excel" },
    { "@type": "SoftwareApplication", name: "1С" },
  ],
};

// SoftwareApplication + Organization + WebSite + FAQPage as one @graph.
// The FAQPage mirrors the visible #faq section exactly (built from the same
// i18n source), as Google's policy requires.
export function LandingJsonLd({ locale }: { locale: Locale }) {
  const url = locale === "ru" ? `${SITE}/ru` : SITE;
  const lang = locale === "ru" ? "ru" : "uz";
  const faq = dicts[locale].faq;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "BirLiy",
        url: SITE,
        logo: `${SITE}/birliy-wordmark.png`,
        foundingDate: "2026",
        sameAs: ["https://t.me/bir_liy"],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: "+998974212454",
          availableLanguage: ["uz", "ru"],
          url: `${SITE}/#lead`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "BirLiy",
        inLanguage: lang,
        publisher: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/#software`,
        name: "BirLiy",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Point of Sale (POS)",
        operatingSystem: "Android, iOS, Web",
        url,
        inLanguage: lang,
        description: APP_DESCRIPTION[locale],
        keywords: APP_KEYWORDS[locale],
        featureList: FEATURE_LIST[locale],
        // Two pricing tiers, machine-readable. priceCurrency MUST be the
        // ISO-4217 code "UZS" here (schema.org requirement). This JSON-LD
        // field is the ONLY place "UZS" is allowed; visible copy uses so'm/сум.
        offers: [
          {
            "@type": "Offer",
            price: "49000",
            priceCurrency: "UZS",
            category: locale === "ru" ? "Первые 6 месяцев" : "Birinchi 6 oy",
          },
          {
            "@type": "Offer",
            price: "149000",
            priceCurrency: "UZS",
            category: locale === "ru" ? "Далее" : "Keyingi oylar",
          },
        ],
        provider: { "@id": `${SITE}/#organization` },
        areaServed: [
          { "@type": "Country", name: "Uzbekistan" },
          { "@type": "City", name: "Tashkent" },
        ],
        isRelatedTo: RELATED_ALTERNATIVES[locale],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: lang,
        mainEntity: faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  // All values are static (i18n + hardcoded), so there is no user input to
  // sanitize. We still escape "<" to < so a stray "</script>" can never
  // break out of the tag — the canonical hardening for inline JSON-LD.
  const json = JSON.stringify(graph).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
