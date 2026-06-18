import Link from "next/link";
import type { BlogLocale, BlogPost } from "@/lib/blog/types";
import { POSTS, BLOG_CATEGORIES, postCategory, postsByCategory, readingTimeMin } from "@/lib/blog";
import type { BlogCategory } from "@/lib/blog";
import { BLOG_UI, blogIndexPath, blogPostPath, landingPath, CATEGORY_LABEL, blogCategoryPath } from "@/lib/blog/i18n";
import { articleJsonLd } from "@/lib/blog/article-jsonld";
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
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = articleJsonLd(post, locale);

  return (
    <div className="min-h-screen bg-paper">
      <HtmlLang lang={ui.htmlLang} />
      <BlogHeader locale={locale} switchPaths={switchPathsFor(post.slug)} />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />

        <nav className="mb-4 flex flex-wrap items-center gap-x-1 text-sm text-ink-500" aria-label="breadcrumb">
          <Link href={landingPath(locale)} className="inline-flex min-h-11 items-center hover:text-ink-900">
            {ui.breadcrumbHome}
          </Link>
          <span aria-hidden>/</span>
          <Link href={blogIndexPath(locale)} className="inline-flex min-h-11 items-center hover:text-ink-900">
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

          <aside className="mt-10 rounded-xl border border-green-200 bg-green-50 p-5">
            <h2 className="font-display text-lg font-semibold text-green-900">{ui.aboutTitle}</h2>
            <p className="mt-2 text-base leading-7 text-green-900">{ui.aboutBody}</p>
            <a href={landingPath(locale)} className="mt-3 inline-block text-sm font-semibold text-green-800 underline">
              birliy.uz
            </a>
          </aside>

          {c.sources && c.sources.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold tracking-tightish text-ink-900">{ui.sourcesTitle}</h2>
              <ol className="mt-4 space-y-2 text-sm leading-6 text-ink-700">
                {c.sources.map((source, i) => (
                  <li key={source.url}>
                    {i + 1}.{" "}
                    <a href={source.url} rel="nofollow noopener" className="font-semibold text-green-800 underline">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}

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

          {related.length > 0 && (
            <section className="mt-14 border-t border-mist pt-8">
              <h2 className="font-display text-xl font-semibold tracking-tightish text-ink-900">{ui.relatedTitle}</h2>
              <div className="mt-5 space-y-3">
                {related.map((r) => {
                  const rc = r.locales[locale];
                  return (
                    <Link
                      key={r.slug}
                      href={blogPostPath(locale, r.slug)}
                      className="block rounded-xl border border-mist bg-white p-4 transition-colors duration-200 hover:border-green-700"
                    >
                      <span className="font-display text-base font-semibold text-ink-900">{rc.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-ink-700">{rc.description}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </article>
      </main>
      <BlogFooter locale={locale} />
    </div>
  );
}

export function BlogCategoryIndex({ category, locale }: { category: BlogCategory; locale: BlogLocale }) {
  const ui = BLOG_UI[locale];
  const posts = postsByCategory(category);
  const label = CATEGORY_LABEL[category][locale];
  const title = ui.categoryTitle(label);
  const description = ui.categoryDescription(label);

  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}${blogCategoryPath(locale, category)}#collection`,
        name: title,
        description,
        url: `${SITE}${blogCategoryPath(locale, category)}`,
        inLanguage: ui.htmlLang,
        isPartOf: { "@id": `${SITE}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.breadcrumbHome, item: `${SITE}${landingPath(locale)}` },
          { "@type": "ListItem", position: 2, name: ui.breadcrumbBlog, item: `${SITE}${blogIndexPath(locale)}` },
          { "@type": "ListItem", position: 3, name: label, item: `${SITE}${blogCategoryPath(locale, category)}` },
        ],
      },
    ],
  };

  const switchPaths: Record<BlogLocale, string> = {
    uz: blogCategoryPath("uz", category),
    ru: blogCategoryPath("ru", category),
    en: blogCategoryPath("en", category),
  };

  return (
    <div className="min-h-screen bg-paper">
      <HtmlLang lang={ui.htmlLang} />
      <BlogHeader locale={locale} switchPaths={switchPaths} />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd).replace(/</g, "\\u003c") }}
        />

        {/* Category tab strip */}
        <nav className="mb-8 flex flex-wrap gap-2" aria-label="blog categories">
          <Link
            href={blogIndexPath(locale)}
            className="inline-block rounded-full border border-mist bg-white px-4 py-1.5 text-sm font-medium text-ink-700 transition-colors duration-200 hover:border-green-700 hover:text-green-800"
          >
            {ui.allPosts}
          </Link>
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = cat === category;
            return (
              <Link
                key={cat}
                href={blogCategoryPath(locale, cat)}
                className={
                  isActive
                    ? "inline-block rounded-full bg-green-700 px-4 py-1.5 text-sm font-medium text-white"
                    : "inline-block rounded-full border border-mist bg-white px-4 py-1.5 text-sm font-medium text-ink-700 transition-colors duration-200 hover:border-green-700 hover:text-green-800"
                }
                aria-current={isActive ? "page" : undefined}
              >
                {CATEGORY_LABEL[cat][locale]}
              </Link>
            );
          })}
        </nav>

        <h1 className="font-display text-3xl font-bold tracking-tightish text-ink-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base leading-7 text-ink-700">{description}</p>

        {posts.length === 0 ? (
          <p className="mt-10 text-base text-ink-500">{ui.categoryEmpty}</p>
        ) : (
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
        )}
      </main>
      <BlogFooter locale={locale} />
    </div>
  );
}

export function BlogIndex({ posts, locale }: { posts: BlogPost[]; locale: BlogLocale }) {
  const ui = BLOG_UI[locale];

  const indexJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}${blogIndexPath(locale)}#blog`,
        name: ui.blogTitle,
        description: ui.blogDescription,
        url: `${SITE}${blogIndexPath(locale)}`,
        inLanguage: ui.htmlLang,
        isPartOf: { "@id": `${SITE}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.breadcrumbHome, item: `${SITE}${landingPath(locale)}` },
          { "@type": "ListItem", position: 2, name: ui.breadcrumbBlog, item: `${SITE}${blogIndexPath(locale)}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-paper">
      <HtmlLang lang={ui.htmlLang} />
      <BlogHeader locale={locale} switchPaths={switchPathsFor()} />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(indexJsonLd).replace(/</g, "\\u003c") }}
        />
        <h1 className="font-display text-3xl font-bold tracking-tightish text-ink-900 sm:text-4xl">{ui.blogTitle}</h1>
        <p className="mt-3 text-base leading-7 text-ink-700">{ui.blogDescription}</p>

        <div className="mt-10 space-y-5">
          {posts.map((post) => {
            const c = post.locales[locale];
            const cat = postCategory(post);
            const catLabel = CATEGORY_LABEL[cat][locale];
            return (
              <Link
                key={post.slug}
                href={blogPostPath(locale, post.slug)}
                className="block rounded-2xl border border-mist bg-white p-6 transition-colors duration-200 hover:border-green-700"
              >
                <div className="mb-2">
                  <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {catLabel}
                  </span>
                </div>
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
