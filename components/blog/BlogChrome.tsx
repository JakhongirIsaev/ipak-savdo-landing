import Link from "next/link";
import Image from "next/image";
import type { BlogLocale } from "@/lib/blog/types";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { BLOG_UI, CATEGORY_LABEL, blogCategoryPath, blogIndexPath, landingPath } from "@/lib/blog/i18n";

const LOCALE_LABEL: Record<BlogLocale, string> = { uz: "O'zbekcha", ru: "Русский", en: "English" };
const LOCALE_SHORT_LABEL: Record<BlogLocale, string> = { uz: "UZ", ru: "RU", en: "EN" };

// The root layout hardcodes lang="uz"; mirror ConceptLanding's client-side
// override so RU/EN blog pages report the right language.
export function HtmlLang({ lang }: { lang: string }) {
  return <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />;
}

export function BlogHeader({ locale, switchPaths }: { locale: BlogLocale; switchPaths: Record<BlogLocale, string> }) {
  const ui = BLOG_UI[locale];
  return (
    <header className="border-b border-mist bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={landingPath(locale)} className="flex min-h-11 shrink-0 items-center gap-2" aria-label="BirLiy">
          <Image src="/birliy-wordmark.png" alt="BirLiy" width={96} height={28} priority className="h-7 w-auto" />
        </Link>
        <nav className="hidden items-center gap-1 rounded-lg border border-mist bg-[#f7faf8] p-1 text-sm md:flex" aria-label={ui.categoriesLabel}>
          <Link href={landingPath(locale)} className="inline-flex min-h-10 items-center rounded-md px-3 font-bold text-ink-700 transition-colors hover:bg-white hover:text-green-800">
            {ui.navHome}
          </Link>
          <Link href={blogIndexPath(locale)} className="inline-flex min-h-10 items-center rounded-md bg-white px-3 font-extrabold text-ink-900 shadow-[0_1px_2px_rgba(11,24,38,0.05)]">
            {ui.breadcrumbBlog}
          </Link>
          {BLOG_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={blogCategoryPath(locale, category)}
              className="inline-flex min-h-10 items-center rounded-md px-3 font-bold text-ink-700 transition-colors hover:bg-white hover:text-green-800"
            >
              {CATEGORY_LABEL[category][locale]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 text-sm text-ink-500 sm:gap-2" aria-label={ui.otherLanguages}>
          {(Object.keys(switchPaths) as BlogLocale[])
            .filter((l) => l !== locale)
            .map((l) => (
              <Link key={l} href={switchPaths[l]} hrefLang={l} className="inline-flex min-h-11 items-center rounded-lg px-2 font-bold hover:bg-[#f1f4f1] hover:text-ink-900">
                <span className="sm:hidden">{LOCALE_SHORT_LABEL[l]}</span>
                <span className="hidden sm:inline">{LOCALE_LABEL[l]}</span>
              </Link>
            ))}
        </div>
      </div>
      <nav className="border-t border-mist md:hidden" aria-label={ui.categoriesLabel}>
        <div className="flex snap-x gap-2 overflow-x-auto px-4 py-3">
          <Link href={landingPath(locale)} className="inline-flex min-h-11 shrink-0 snap-start items-center rounded-full border border-mist bg-white px-4 text-sm font-extrabold text-ink-700">
            {ui.navHome}
          </Link>
          <Link href={blogIndexPath(locale)} className="inline-flex min-h-11 shrink-0 snap-start items-center rounded-full bg-ink-900 px-4 text-sm font-extrabold text-white">
            {ui.breadcrumbBlog}
          </Link>
          {BLOG_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={blogCategoryPath(locale, category)}
              className="inline-flex min-h-11 shrink-0 snap-start items-center rounded-full border border-mist bg-white px-4 text-sm font-extrabold text-ink-700"
            >
              {CATEGORY_LABEL[category][locale]}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function BlogFooter({ locale }: { locale: BlogLocale }) {
  const ui = BLOG_UI[locale];
  return (
    <footer className="border-t border-mist bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-[1fr_1.4fr_1fr] lg:px-8">
        <div>
          <Link href={landingPath(locale)} className="inline-flex min-h-11 items-center" aria-label="BirLiy">
            <Image src="/birliy-wordmark.png" alt="BirLiy" width={96} height={28} className="h-7 w-auto" />
          </Link>
          <p className="mt-3 max-w-[24ch] font-bold leading-6 text-ink-500">BirLiy · birliy.uz</p>
        </div>
        <nav className="grid gap-2 sm:grid-cols-2" aria-label={ui.categoriesLabel}>
          <Link href={blogIndexPath(locale)} className="inline-flex min-h-11 items-center font-extrabold text-ink-900 hover:text-green-800">
            {ui.allPosts}
          </Link>
          {BLOG_CATEGORIES.map((category) => (
            <Link key={category} href={blogCategoryPath(locale, category)} className="inline-flex min-h-11 items-center font-bold text-ink-700 hover:text-green-800">
              {CATEGORY_LABEL[category][locale]}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <Link href={landingPath(locale)} className="inline-flex min-h-11 items-center font-bold text-ink-700 hover:text-ink-900">
            {ui.backToSite}
          </Link>
          <div className="flex flex-wrap gap-2" aria-label={ui.otherLanguages}>
            {(Object.keys(LOCALE_LABEL) as BlogLocale[]).map((l) => (
              <Link
                key={l}
                href={l === locale ? blogIndexPath(l) : blogIndexPath(l)}
                hrefLang={l}
                className={`inline-flex min-h-11 items-center rounded-full px-3 text-xs font-extrabold ${
                  l === locale ? "bg-ink-900 text-white" : "border border-mist text-ink-700 hover:bg-[#f7faf8]"
                }`}
              >
                {LOCALE_LABEL[l]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
