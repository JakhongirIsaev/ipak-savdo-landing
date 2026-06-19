import type { BlogLocale, BlogCategory } from "./types";

// Chrome strings for the blog UI per locale.
export const BLOG_UI: Record<
  BlogLocale,
  {
    blogTitle: string;
    blogDescription: string;
    breadcrumbHome: string;
    breadcrumbBlog: string;
    readingTime: (min: number) => string;
    faqTitle: string;
    relatedTitle: string;
    sourcesTitle: string;
    aboutTitle: string;
    aboutBody: string;
    allPosts: string;
    backToSite: string;
    published: string;
    otherLanguages: string;
    htmlLang: string;
    ogLocale: string;
    categoryTitle: (label: string) => string;
    categoryDescription: (label: string) => string;
    categoryEmpty: string;
  }
> = {
  uz: {
    blogTitle: "BirLiy blog: do'kon yuritish bo'yicha maslahatlar",
    blogDescription:
      "Kassa, ombor hisobi, QR to'lov va do'kon boshqaruvi haqida amaliy maqolalar. O'zbekiston kichik biznesi uchun.",
    breadcrumbHome: "Bosh sahifa",
    breadcrumbBlog: "Blog",
    readingTime: (min) => `${min} daqiqa o'qiladi`,
    faqTitle: "Ko'p so'raladigan savollar",
    relatedTitle: "Tegishli maqolalar",
    sourcesTitle: "Manbalar",
    aboutTitle: "BirLiy haqida qisqacha",
    aboutBody:
      "BirLiy: O'zbekistondagi uy yonidagi do'kon va minimarketlar uchun telefonda ishlaydigan POS dasturi. Kassa, ombor, QR to'lov va egasi hisobotlari bitta ilovada.",
    allPosts: "Barcha maqolalar",
    backToSite: "birliy.uz saytiga qaytish",
    published: "Chop etilgan",
    otherLanguages: "Boshqa tillarda",
    htmlLang: "uz",
    ogLocale: "uz_UZ",
    categoryTitle: (label) => `${label} bo'yicha maqolalar`,
    categoryDescription: (label) => `BirLiy blogining "${label}" bo'limidagi barcha maqolalar.`,
    categoryEmpty: "Bu turkumda hozircha maqolalar yo'q.",
  },
  ru: {
    blogTitle: "Блог BirLiy: советы по управлению магазином",
    blogDescription:
      "Практичные статьи о кассе, складском учёте, QR-оплате и управлении магазином. Для малого бизнеса Узбекистана.",
    breadcrumbHome: "Главная",
    breadcrumbBlog: "Блог",
    readingTime: (min) => `${min} мин чтения`,
    faqTitle: "Частые вопросы",
    relatedTitle: "Похожие статьи",
    sourcesTitle: "Источники",
    aboutTitle: "Коротко о BirLiy",
    aboutBody:
      "BirLiy: POS-система в телефоне для магазинов у дома и минимаркетов Узбекистана. Касса, склад, QR-оплата и отчёты владельца находятся в одном приложении.",
    allPosts: "Все статьи",
    backToSite: "Вернуться на birliy.uz",
    published: "Опубликовано",
    otherLanguages: "На других языках",
    htmlLang: "ru",
    ogLocale: "ru_RU",
    categoryTitle: (label) => `Статьи: ${label}`,
    categoryDescription: (label) => `Все статьи блога BirLiy в разделе «${label}».`,
    categoryEmpty: "В этой категории пока нет статей.",
  },
  en: {
    blogTitle: "BirLiy blog: practical advice for shop owners",
    blogDescription:
      "Practical articles on POS, inventory tracking, QR payments and running a small shop in Uzbekistan.",
    breadcrumbHome: "Home",
    breadcrumbBlog: "Blog",
    readingTime: (min) => `${min} min read`,
    faqTitle: "Frequently asked questions",
    relatedTitle: "Related articles",
    sourcesTitle: "Sources",
    aboutTitle: "BirLiy at a glance",
    aboutBody:
      "BirLiy is a phone-first POS app for neighborhood shops and minimarkets in Uzbekistan. It combines checkout, inventory, QR payments and owner reports in one app.",
    allPosts: "All articles",
    backToSite: "Back to birliy.uz",
    published: "Published",
    otherLanguages: "In other languages",
    htmlLang: "en",
    ogLocale: "en_US",
    categoryTitle: (label) => `Articles: ${label}`,
    categoryDescription: (label) => `All BirLiy blog articles in the "${label}" category.`,
    categoryEmpty: "No articles in this category yet.",
  },
};

// URL prefix per locale. uz is the site default and lives at the root.
export const LOCALE_PREFIX: Record<BlogLocale, string> = {
  uz: "",
  ru: "/ru",
  en: "/en",
};

export function blogIndexPath(locale: BlogLocale): string {
  return `${LOCALE_PREFIX[locale]}/blog`;
}

export function blogPostPath(locale: BlogLocale, slug: string): string {
  return `${LOCALE_PREFIX[locale]}/blog/${slug}`;
}

export function landingPath(locale: BlogLocale): string {
  // uz -> root, ru -> /ru. There is no English landing yet, so EN blog pages
  // point at the uz root (the x-default), NOT /ru: an English article's
  // breadcrumb/home must not resolve to a Russian-language page.
  return locale === "ru" ? "/ru" : "/";
}

export const CATEGORY_LABEL: Record<BlogCategory, Record<BlogLocale, string>> = {
  product: { uz: "Mahsulot", ru: "Продукт", en: "Product" },
  "ai-tech": { uz: "AI va texnologiya", ru: "AI и технологии", en: "AI & Technology" },
  football: { uz: "Futbol", ru: "Футбол", en: "Football" },
};

export function blogCategoryPath(locale: BlogLocale, category: BlogCategory): string {
  return `${LOCALE_PREFIX[locale]}/blog/category/${category}`;
}
