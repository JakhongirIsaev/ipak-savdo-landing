import { dicts } from "@/lib/landing/i18n";

type Locale = keyof typeof dicts;

const SITE = "https://birliy.uz";

// Machine-readable product descriptions (JSON-LD only — never shown to users).
// These carry the broader search-intent vocabulary (ERP / biznes dasturi / POS /
// ombor boshqaruvi) that the visible landing copy intentionally does not use.
const APP_DESCRIPTION: Record<Locale, string> = {
  uz: "BirLiy: kichik va o'rta biznes uchun savdoni avtomatlashtirish dasturi, kassa, ombor boshqaruvi va tovar qoldig'i hisobi, QR to'lov, moliya hamda hisobotlar bitta ilovada. Do'kon, minimarket, kafe va dorixonalar uchun soddalashtirilgan ERP / biznes dasturi va POS (savdo nuqtasi) yechimi.",
  ru: "BirLiy: программа автоматизации торговли для малого и среднего бизнеса, касса, управление складом и учёт остатков, QR-оплата, финансы и отчёты в одном приложении. Простая ERP / бизнес-программа и POS-система (торговая точка) для магазинов, минимаркетов, кафе и аптек.",
};

const APP_KEYWORDS: Record<Locale, string> = {
  uz: "kassa dasturi, savdo dasturi, savdo avtomatlashtirish, ombor dasturi, ombor boshqaruvi, tovar qoldig'i, tovar hisobi, ERP tizimi, ERP dasturi, biznes dasturi, biznes avtomatlashtirish, POS terminal, POS dasturi, savdo nuqtasi, QR to'lov, do'kon uchun kassa, minimarket dasturi, kafe uchun kassa, dorixona dasturi",
  ru: "касса для магазина, POS система, POS терминал, торговая точка, ERP система, ERP для бизнеса, бизнес-программа, автоматизация магазина, автоматизация торговли, складской учёт, управление складом, учёт товаров, учёт остатков, QR оплата, программа для магазина, программа для кафе, программа для аптеки",
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
        sameAs: ["https://t.me/bir_liy"],
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
        operatingSystem: "Android, iOS, Web",
        url,
        inLanguage: lang,
        description: APP_DESCRIPTION[locale],
        keywords: APP_KEYWORDS[locale],
        offers: {
          "@type": "Offer",
          price: "49000",
          priceCurrency: "UZS",
          category: locale === "ru" ? "Первые 6 месяцев" : "Birinchi 6 oy",
        },
        provider: { "@id": `${SITE}/#organization` },
        areaServed: { "@type": "Country", name: "Uzbekistan" },
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
