import Link from "next/link";
import Image from "next/image";
import type { BlogLocale } from "@/lib/blog/types";
import { BLOG_UI, blogIndexPath, landingPath } from "@/lib/blog/i18n";

const LOCALE_LABEL: Record<BlogLocale, string> = { uz: "O'zbekcha", ru: "Русский", en: "English" };

// The root layout hardcodes lang="uz"; mirror ConceptLanding's client-side
// override so RU/EN blog pages report the right language.
export function HtmlLang({ lang }: { lang: string }) {
  return <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />;
}

export function BlogHeader({ locale, switchPaths }: { locale: BlogLocale; switchPaths: Record<BlogLocale, string> }) {
  const ui = BLOG_UI[locale];
  return (
    <header className="border-b border-mist bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href={landingPath(locale)} className="flex items-center gap-2" aria-label="BirLiy">
          <Image src="/birliy-wordmark.png" alt="BirLiy" width={96} height={28} className="h-7 w-auto" />
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href={blogIndexPath(locale)} className="font-medium text-ink-900 hover:text-green-700">
            {ui.breadcrumbBlog}
          </Link>
          <div className="flex items-center gap-2 text-ink-500" aria-label={ui.otherLanguages}>
            {(Object.keys(switchPaths) as BlogLocale[])
              .filter((l) => l !== locale)
              .map((l) => (
                <Link key={l} href={switchPaths[l]} hrefLang={l} className="hover:text-ink-900">
                  {LOCALE_LABEL[l]}
                </Link>
              ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

export function BlogFooter({ locale }: { locale: BlogLocale }) {
  const ui = BLOG_UI[locale];
  return (
    <footer className="border-t border-mist bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 text-sm text-ink-500">
        <Link href={landingPath(locale)} className="hover:text-ink-900">
          {ui.backToSite}
        </Link>
        <span>BirLiy · birliy.uz</span>
      </div>
    </footer>
  );
}
