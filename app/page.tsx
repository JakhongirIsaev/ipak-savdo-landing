import type { Metadata } from "next";
import ConceptLanding from "@/components/concept/ConceptLanding";
import { LandingJsonLd } from "@/components/landing/JsonLd";

const LANGUAGES = {
  uz: "https://birliy.uz/",
  ru: "https://birliy.uz/ru",
  "x-default": "https://birliy.uz/",
};

export const metadata: Metadata = {
  title: "BirLiy: minimarket uchun telefondagi POS va ombor",
  description:
    "Uy yonidagi do'kon va minimarketlar uchun telefondagi POS: kassa, ombor hisobi, QR to'lov va hisobotlar. Birinchi 6 oy oyiga 49 000 so'm.",
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
    "onlayn kassa",
    "kassa ilovasi",
    "telefon uchun kassa",
    "savdo hisobi",
    "do'kon dasturi",
    "do'kon hisobi",
    "qoldiq hisobi",
    "ombor hisobi dasturi",
    "inventarizatsiya dasturi",
    "qarz daftari ilovasi",
    "chek Telegram orqali",
    "QR orqali to'lov qabul qilish",
    "shtrix kod skaneri",
    "kichik biznes uchun dastur",
    "oziq-ovqat do'koni dasturi",
    "savdo nuqtasi dasturi",
    "kassir nazorati",
    "savdo hisoboti",
    "Toshkent kassa dasturi",
    "BirLiy",
  ],
  alternates: { canonical: "https://birliy.uz/", languages: LANGUAGES },
  openGraph: {
    title: "BirLiy: minimarket uchun telefondagi POS",
    description:
      "Uy yonidagi do'kon va minimarket uchun kassa, ombor, QR to'lov va hisobotlar bitta telefon ilovasida.",
    type: "website",
    locale: "uz_UZ",
    alternateLocale: "ru_RU",
    url: "https://birliy.uz/",
    siteName: "BirLiy",
    images: [{ url: "/photos/owner-tablet.jpg", width: 1120, height: 840, alt: "BirLiy do'kon uchun kassa dasturi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BirLiy: minimarket uchun telefondagi POS",
    description: "Kassa, ombor, QR to'lov va hisobotlar bitta telefon ilovasida.",
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
