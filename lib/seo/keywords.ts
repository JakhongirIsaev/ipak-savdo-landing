// Tracked keywords for the SerpApi rank tracker.
// Each entry maps to one (keyword, locale) snapshot per refresh.

export interface TrackedKeyword {
  keyword: string;
  locale: "uz" | "ru";
}

export const TRACKED_KEYWORDS: TrackedKeyword[] = [
  // ── Uzbek ────────────────────────────────────────────────────────────────
  { keyword: "magazin uchun dastur", locale: "uz" },
  { keyword: "magazin uchun programma", locale: "uz" },
  { keyword: "do'kon uchun dastur", locale: "uz" },
  { keyword: "dukon uchun dastur", locale: "uz" },
  { keyword: "minimarket uchun dastur", locale: "uz" },
  { keyword: "oziq-ovqat do'koni dasturi", locale: "uz" },
  { keyword: "telefonda kassa", locale: "uz" },
  { keyword: "kassa programma", locale: "uz" },
  { keyword: "kassa apparat kerakmi", locale: "uz" },
  { keyword: "kassa aparatsiz savdo", locale: "uz" },
  { keyword: "qarz daftar", locale: "uz" },
  { keyword: "qarz daftari", locale: "uz" },
  { keyword: "nasiya daftar", locale: "uz" },
  { keyword: "ombor hisobi", locale: "uz" },
  { keyword: "tovar qoldig'i", locale: "uz" },
  { keyword: "do'konda nima qolganini bilish", locale: "uz" },
  { keyword: "tovar sanash", locale: "uz" },
  { keyword: "internetsiz kassa", locale: "uz" },

  // ── Russian ───────────────────────────────────────────────────────────────
  { keyword: "программа для магазина", locale: "ru" },
  { keyword: "программа для магазина продуктов", locale: "ru" },
  { keyword: "программа для минимаркета", locale: "ru" },
  { keyword: "программа для магазина у дома", locale: "ru" },
  { keyword: "касса в телефоне", locale: "ru" },
  { keyword: "мобильная касса", locale: "ru" },
  { keyword: "касса для магазина", locale: "ru" },
  { keyword: "касса без интернета", locale: "ru" },
  { keyword: "касса для магазина цена", locale: "ru" },
  { keyword: "долговая тетрадь", locale: "ru" },
  { keyword: "тетрадь долгов", locale: "ru" },
  { keyword: "чем заменить тетрадь долгов", locale: "ru" },
  { keyword: "учет остатков в магазине", locale: "ru" },
  { keyword: "складской учет для магазина", locale: "ru" },
  { keyword: "учет товаров в магазине", locale: "ru" },
  { keyword: "программа учета продаж", locale: "ru" },
  { keyword: "программа для торговли", locale: "ru" },
  { keyword: "QR оплата без терминала", locale: "ru" },
];
