import type { BlogLocale } from "./types";

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
    allPosts: string;
    backToSite: string;
    published: string;
    otherLanguages: string;
    htmlLang: string;
    ogLocale: string;
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
    allPosts: "Barcha maqolalar",
    backToSite: "birliy.uz saytiga qaytish",
    published: "Chop etilgan",
    otherLanguages: "Boshqa tillarda",
    htmlLang: "uz",
    ogLocale: "uz_UZ",
  },
  ru: {
    blogTitle: "Блог BirLiy: советы по управлению магазином",
    blogDescription:
      "Практичные статьи о кассе, складском учёте, QR-оплате и управлении магазином. Для малого бизнеса Узбекистана.",
    breadcrumbHome: "Главная",
    breadcrumbBlog: "Блог",
    readingTime: (min) => `${min} мин чтения`,
    faqTitle: "Частые вопросы",
    allPosts: "Все статьи",
    backToSite: "Вернуться на birliy.uz",
    published: "Опубликовано",
    otherLanguages: "На других языках",
    htmlLang: "ru",
    ogLocale: "ru_RU",
  },
  en: {
    blogTitle: "BirLiy blog: practical advice for shop owners",
    blogDescription:
      "Practical articles on POS, inventory tracking, QR payments and running a small shop in Uzbekistan.",
    breadcrumbHome: "Home",
    breadcrumbBlog: "Blog",
    readingTime: (min) => `${min} min read`,
    faqTitle: "Frequently asked questions",
    allPosts: "All articles",
    backToSite: "Back to birliy.uz",
    published: "Published",
    otherLanguages: "In other languages",
    htmlLang: "en",
    ogLocale: "en_US",
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
  // There is no English landing yet: EN blog pages link to the Russian one.
  return locale === "uz" ? "/" : "/ru";
}
