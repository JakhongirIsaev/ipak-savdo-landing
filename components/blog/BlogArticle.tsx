import Link from "next/link";
import type { BlogLocale, BlogPost } from "@/lib/blog/types";
import { readingTimeMin } from "@/lib/blog";
import { BLOG_UI, blogIndexPath, blogPostPath, landingPath } from "@/lib/blog/i18n";
import { BlogHeader, BlogFooter, HtmlLang } from "./BlogChrome";

const SITE = "https://birliy.uz";

function switchPathsFor(slug?: string): Record<BlogLocale, string> {
  return {
    uz: slug ? blogPostPath("uz", slug) : blogIndexPath("uz"),
    ru: slug ? blogPostPath("ru", slug) : blogIndexPath("ru"),
    en: slug ? blogPostPath("en", slug) : blogIndexPath("en"),
  };
}

export function BlogArticle({ post, locale }: { post: BlogPost; locale: BlogLocale }) {
  const ui = BLOG_UI[locale];
  const c = post.locales[locale];
  const minutes = readingTimeMin(post, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: c.title,
        description: c.description,
        keywords: c.keywords.join(", "),
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: ui.htmlLang,
        mainEntityOfPage: `${SITE}${blogPostPath(locale, post.slug)}`,
        author: { "@type": "Organization", name: "BirLiy", url: SITE },
        publisher: { "@type": "Organization", name: "BirLiy", url: SITE },
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.breadcrumbHome, item: `${SITE}${landingPath(locale)}` },
          { "@type": "ListItem", position: 2, name: ui.breadcrumbBlog, item: `${SITE}${blogIndexPath(locale)}` },
          { "@type": "ListItem", position: 3, name: c.title },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-paper">
      <HtmlLang lang={ui.htmlLang} />
      <BlogHeader locale={locale} switchPaths={switchPathsFor(post.slug)} />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />

        <nav className="mb-6 text-sm text-ink-500" aria-label="breadcrumb">
          <Link href={landingPath(locale)} className="hover:text-ink-900">
            {ui.breadcrumbHome}
          </Link>
          {" / "}
          <Link href={blogIndexPath(locale)} className="hover:text-ink-900">
            {ui.breadcrumbBlog}
          </Link>
        </nav>

        <article>
          <h1 className="font-display text-3xl font-bold tracking-tightish text-ink-900 sm:text-4xl">{c.title}</h1>
          <p className="mt-3 text-sm text-ink-500">
            {ui.published}: {post.date} · {ui.readingTime(minutes)}
          </p>

          <div className="mt-8 space-y-5">
            {c.intro.map((p, i) => (
              <p key={i} className="text-base leading-7 text-ink-700">
                {p}
              </p>
            ))}
          </div>

          {c.sections.map((s, i) => (
            <section key={i} className="mt-10">
              <h2 className="font-display text-2xl font-semibold tracking-tightish text-ink-900">{s.h2}</h2>
              <div className="mt-4 space-y-4">
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="text-base leading-7 text-ink-700">
                    {p}
                  </p>
                ))}
              </div>
              {s.list && (
                <ul className="mt-4 space-y-2.5">
                  {s.list.map((item, j) => (
                    <li key={j} className="flex gap-2.5 text-base leading-7 text-ink-700">
                      <span aria-hidden className="mt-0.5 shrink-0 text-green-700">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tightish text-ink-900">{ui.faqTitle}</h2>
            <div className="mt-5 space-y-4">
              {c.faq.map((f, i) => (
                <details key={i} className="rounded-xl border border-mist bg-white p-5">
                  <summary className="cursor-pointer text-base font-semibold text-ink-900">{f.q}</summary>
                  <p className="mt-3 text-base leading-7 text-ink-700">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-12 rounded-2xl bg-ink-900 p-7 text-white">
            <p className="text-lg leading-7">{c.cta.text}</p>
            <a
              href={`${landingPath(locale)}#lead`}
              className="mt-5 inline-block rounded-xl bg-green-700 px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-green-800"
            >
              {c.cta.button}
            </a>
          </div>
        </article>
      </main>
      <BlogFooter locale={locale} />
    </div>
  );
}

export function BlogIndex({ posts, locale }: { posts: BlogPost[]; locale: BlogLocale }) {
  const ui = BLOG_UI[locale];
  return (
    <div className="min-h-screen bg-paper">
      <HtmlLang lang={ui.htmlLang} />
      <BlogHeader locale={locale} switchPaths={switchPathsFor()} />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="font-display text-3xl font-bold tracking-tightish text-ink-900 sm:text-4xl">{ui.blogTitle}</h1>
        <p className="mt-3 text-base leading-7 text-ink-700">{ui.blogDescription}</p>

        <div className="mt-10 space-y-5">
          {posts.map((post) => {
            const c = post.locales[locale];
            return (
              <Link
                key={post.slug}
                href={blogPostPath(locale, post.slug)}
                className="block rounded-2xl border border-mist bg-white p-6 transition-colors duration-200 hover:border-green-700"
              >
                <h2 className="font-display text-xl font-semibold tracking-tightish text-ink-900">{c.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-700">{c.description}</p>
                <p className="mt-3 text-xs text-ink-500">
                  {post.date} · {ui.readingTime(readingTimeMin(post, locale))}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
      <BlogFooter locale={locale} />
    </div>
  );
}
