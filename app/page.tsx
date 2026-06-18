import type { Metadata } from "next";
import ConceptLanding from "@/components/concept/ConceptLanding";
import { LandingJsonLd } from "@/components/landing/JsonLd";

const LANGUAGES = {
  uz: "https://birliy.uz/",
  ru: "https://birliy.uz/ru",
  "x-default": "https://birliy.uz/",
};

export const metadata: Metadata = {
  title: "BirLiy: telefonda kassa, ombor va qarz daftari do'kon uchun",
  description:
    "Magazin uchun dastur: telefonda kassa, ombor hisobi, qarz daftari (nasiya), QR to'lov va hisobotlar bitta ilovada. Boshlash uchun alohida uskuna sotib olish shart emas, internetsiz ham ishlaydi. Birinchi 6 oy oyiga 49 000 so'm. Ariza qoldiring.",
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
    "nasiya daftar dasturi",
    "qarz hisobi dasturi",
    "internetsiz ishlaydigan kassa dasturi",
    "telefonda kassa",
    "mobil kassa dasturi",
    "kichik do'kon uchun kassa dasturi",
    "terminalsiz QR to'lov",
    "do'kon uchun dastur",
    "dukan uchun telefon kassa",
    "BirLiy narxi qancha",
    "BirLiy",
    "magazin uchun dastur",
    "magazin uchun programma",
    "kassa programma",
    "qarz daftar",
    "ombor hisobi",
    "telefon orqali kassa",
    "kassa apparat kerakmi",
    "kassa aparatsiz savdo",
    "do'konda nima qolganini bilish",
    "tovar sanash",
    "nasiya daftar",
    "savdo uchun programma",
  ],
  alternates: {
    canonical: "https://birliy.uz/",
    languages: LANGUAGES,
    types: { "application/rss+xml": "https://birliy.uz/feed.xml" },
  },
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
