import type { Metadata } from "next";
import ConceptLanding from "@/components/concept/ConceptLanding";
import { LandingJsonLd } from "@/components/landing/JsonLd";

const LANGUAGES = {
  uz: "https://birliy.uz/",
  ru: "https://birliy.uz/ru",
  "x-default": "https://birliy.uz/",
};

export const metadata: Metadata = {
  title: "BirLiy: kassa, ombor va QR to'lov | 49 000 so'mdan",
  description:
    "BirLiy: kassa, ombor hisobi, QR to'lov va hisobotlar bitta ilovada, telefonda. Do'kon, minimarket, kafe va dorixonalar uchun. Birinchi 6 oy: oyiga 49 000 so'mdan.",
  keywords: [
    "kassa dasturi",
    "savdo dasturi",
    "savdo avtomatlashtirish",
    "ombor dasturi",
    "ombor boshqaruvi",
    "tovar qoldig'i",
    "tovar hisobi",
    "ERP tizimi",
    "ERP dasturi",
    "biznes dasturi",
    "biznes avtomatlashtirish",
    "POS terminal",
    "POS dasturi",
    "savdo nuqtasi",
    "do'kon uchun kassa",
    "QR to'lov",
    "dorixona dasturi",
    "kafe uchun kassa",
    "minimarket dasturi",
    "BirLiy",
  ],
  alternates: { canonical: "https://birliy.uz/", languages: LANGUAGES },
  openGraph: {
    title: "BirLiy: do'kon uchun kassa, ombor va QR to'lov dasturi",
    description:
      "Kassa, ombor, QR to'lov va hisobotlar bitta ilovada, telefonda. Do'kon, minimarket, kafe va dorixonalar uchun. Oyiga 49 000 so'mdan.",
    type: "website",
    locale: "uz_UZ",
    alternateLocale: "ru_RU",
    url: "https://birliy.uz/",
    siteName: "BirLiy",
    images: [{ url: "/photos/owner-tablet.jpg", width: 1200, height: 1500, alt: "BirLiy do'kon uchun kassa dasturi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BirLiy: do'kon uchun kassa dasturi",
    description: "Kassa, ombor, QR to'lov, hisobotlar bitta ilovada. Oyiga 49 000 so'mdan.",
    images: ["/photos/owner-tablet.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <LandingJsonLd locale="uz" />
      <ConceptLanding initialLocale="uz" />
    </>
  );
}
