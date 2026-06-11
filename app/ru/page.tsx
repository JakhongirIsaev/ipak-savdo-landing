import type { Metadata } from "next";
import ConceptLanding from "@/components/concept/ConceptLanding";
import { LandingJsonLd } from "@/components/landing/JsonLd";

const LANGUAGES = {
  uz: "https://birliy.uz/",
  ru: "https://birliy.uz/ru",
  "x-default": "https://birliy.uz/",
};

export const metadata: Metadata = {
  title: "BirLiy: Касса, склад и QR-оплата для магазина | Старт 49 000 сум/мес",
  description:
    "BirLiy: касса, склад, QR-оплата и отчёты в одном приложении на телефоне. Для магазинов, минимаркетов, кафе и аптек в Узбекистане. Старт 49 000 сум/мес первые 6 месяцев.",
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
    "BirLiy",
  ],
  alternates: { canonical: "https://birliy.uz/ru", languages: LANGUAGES },
  openGraph: {
    title: "BirLiy: касса, склад и оплаты в одном приложении",
    description: "Всё для магазина на телефоне: касса, склад, QR-оплата, отчёты. Старт 49 000 сум/мес первые 6 месяцев.",
    type: "website",
    locale: "ru_RU",
    alternateLocale: "uz_UZ",
    url: "https://birliy.uz/ru",
    siteName: "BirLiy",
    images: [{ url: "/photos/owner-tablet.jpg", width: 1200, height: 1500, alt: "BirLiy касса для магазина" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BirLiy: касса для магазина",
    description: "Касса, склад, QR-оплата, отчёты в одном приложении. Старт 49 000 сум/мес первые 6 месяцев.",
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
