import type { Metadata } from "next";
import ConceptLanding from "@/components/concept/ConceptLanding";
import { LandingJsonLd } from "@/components/landing/JsonLd";

const LANGUAGES = {
  uz: "https://birliy.uz/",
  ru: "https://birliy.uz/ru",
  "x-default": "https://birliy.uz/",
};

export const metadata: Metadata = {
  title: "BirLiy: POS в телефоне для магазина и минимаркета",
  description:
    "POS в телефоне для магазинов у дома и минимаркетов Узбекистана: касса, склад, QR-оплата и отчёты. Первые 6 месяцев 49 000 сум/мес.",
  keywords: [
    "касса для магазина",
    "POS система",
    "POS терминал",
    "POS Узбекистан",
    "торговая точка",
    "ERP система",
    "ERP для бизнеса",
    "бизнес-программа",
    "автоматизация магазина",
    "автоматизация торговли",
    "складской учёт",
    "управление складом",
    "учёт товаров",
    "учёт остатков",
    "QR оплата",
    "программа для магазина",
    "программа для кафе",
    "программа для аптеки",
    "онлайн касса",
    "касса в телефоне",
    "мобильная касса",
    "кассовое приложение",
    "кассовая программа",
    "программа учёта продаж",
    "учёт продаж",
    "программа для торговли",
    "программа для минимаркета",
    "контроль остатков",
    "инвентаризация в магазине",
    "учёт долгов покупателей",
    "контроль кассира",
    "отчёты по продажам",
    "сканер штрихкодов телефоном",
    "чек в Telegram",
    "приём оплаты по QR",
    "программа для малого бизнеса",
    "касса Ташкент",
    "BirLiy",
  ],
  alternates: { canonical: "https://birliy.uz/ru", languages: LANGUAGES },
  openGraph: {
    title: "BirLiy: POS в телефоне для минимаркета",
    description: "Касса, склад, QR-оплата и отчёты для магазина у дома и минимаркета в одном приложении.",
    type: "website",
    locale: "ru_RU",
    alternateLocale: "uz_UZ",
    url: "https://birliy.uz/ru",
    siteName: "BirLiy",
    images: [{ url: "/photos/owner-tablet.jpg", width: 1120, height: 840, alt: "BirLiy касса для магазина" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BirLiy: POS в телефоне для минимаркета",
    description: "Касса, склад, QR-оплата и отчёты в одном приложении.",
    images: ["/photos/owner-tablet.jpg"],
  },
};

export default function HomeRu() {
  return (
    <>
      <LandingJsonLd locale="ru" />
      <ConceptLanding initialLocale="ru" />
    </>
  );
}
