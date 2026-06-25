import Link from "next/link";
import Image from "next/image";
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

// BlogPost.image holds ABSOLUTE URLs (https://birliy.uz/...) for JSON-LD/OG.
// For the on-page <img> serve them as same-origin relative paths so they work
// in local dev and on the standalone server without next/image remote config.
function imgPath(url: string): string {
  return url.startsWith(SITE) ? url.slice(SITE.length) : url;
}

// Shared archive card used on the blog index, category pages, and related
// articles. The full card is clickable, mirroring the simple archive pattern
// users expect from a clean blog index.
function PostCard({ post, locale }: { post: BlogPost; locale: BlogLocale }) {
  const ui = BLOG_UI[locale];
  const c = post.locales[locale];
  const catLabel = CATEGORY_LABEL[postCategory(post)][locale];
  return (
    <Link
      href={blogPostPath(locale, post.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-mist bg-white shadow-[0_1px_2px_rgba(11,24,38,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-green-700 hover:shadow-[0_24px_56px_-38px_rgba(11,24,38,0.48)]"
    >
      {post.image && (
        <div className="overflow-hidden bg-paper">
          <Image
            src={imgPath(post.image.landscape)}
            alt={c.title}
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold text-ink-500">
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-800">{catLabel}</span>
          <span>{ui.readingTime(readingTimeMin(post, locale))}</span>
        </div>
        <h2 className="font-display text-xl font-extrabold leading-snug tracking-normal text-ink-900 transition-colors duration-200 group-hover:text-green-800">
          {c.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-700">{c.description}</p>
        <span className="mt-auto inline-flex min-h-11 items-end pt-4 text-sm font-extrabold text-green-800">
          {ui.readArticle}
        </span>
      </div>
    </Link>
  );
}

function CategoryStrip({ locale, activeCategory }: { locale: BlogLocale; activeCategory?: BlogCategory }) {
  const ui = BLOG_UI[locale];
  return (
    <nav className="mt-8 flex flex-wrap gap-2" aria-label={ui.categoriesLabel}>
      <Link
        href={blogIndexPath(locale)}
        aria-current={activeCategory ? undefined : "page"}
        className={
          activeCategory
            ? "inline-flex min-h-11 items-center rounded-full border border-mist bg-white px-4 text-sm font-extrabold text-ink-700 transition-colors hover:border-green-700 hover:text-green-800"
            : "inline-flex min-h-11 items-center rounded-full bg-ink-900 px-4 text-sm font-extrabold text-white"
        }
      >
        {ui.allPosts}
        <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">{POSTS.length}</span>
      </Link>
      {BLOG_CATEGORIES.map((category) => {
        const active = activeCategory === category;
        return (
          <Link
            key={category}
            href={blogCategoryPath(locale, category)}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "inline-flex min-h-11 items-center rounded-full bg-green-700 px-4 text-sm font-extrabold text-white"
                : "inline-flex min-h-11 items-center rounded-full border border-mist bg-white px-4 text-sm font-extrabold text-ink-700 transition-colors hover:border-green-700 hover:text-green-800"
            }
          >
            {CATEGORY_LABEL[category][locale]}
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/18" : "bg-[#f1f4f1] text-ink-500"}`}>
              {postsByCategory(category).length}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function BlogArticle({ post, locale }: { post: BlogPost; locale: BlogLocale }) {
  const ui = BLOG_UI[locale];
  const c = post.locales[locale];
  const minutes = readingTimeMin(post, locale);
  // Prefer related posts from the same category, then fill from the rest.
  const sameCat = POSTS.filter((p) => p.slug !== post.slug && postCategory(p) === postCategory(post));
  const otherCat = POSTS.filter((p) => p.slug !== post.slug && postCategory(p) !== postCategory(post));
  const related = [...sameCat, ...otherCat].slice(0, 2);

  const jsonLd = articleJsonLd(post, locale);

  return (
    <div lang={ui.htmlLang} className="min-h-screen bg-paper">
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
          <div className="mb-3">
            <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800">
              {CATEGORY_LABEL[postCategory(post)][locale]}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tightish text-ink-900 sm:text-4xl">{c.title}</h1>
          <p className="mt-3 text-sm text-ink-500">
            {ui.published}: {post.date} · {ui.readingTime(minutes)}
          </p>

          {post.image && (
            <figure className="mt-6 overflow-hidden rounded-2xl border border-mist">
              <Image
                src={imgPath(post.image.wide)}
                alt={c.title}
                width={1200}
                height={675}
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="aspect-[16/9] w-full object-cover"
              />
            </figure>
          )}

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
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {related.map((r) => (
                  <PostCard key={r.slug} post={r} locale={locale} />
                ))}
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
    <div lang={ui.htmlLang} className="min-h-screen bg-paper">
      <HtmlLang lang={ui.htmlLang} />
      <BlogHeader locale={locale} switchPaths={switchPaths} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd).replace(/</g, "\\u003c") }}
        />

        <section className="rounded-2xl border border-mist bg-white p-6 shadow-[0_24px_70px_-55px_rgba(11,24,38,0.45)] sm:p-8">
          <p className="text-sm font-extrabold uppercase tracking-normal text-green-700">{ui.blogEyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-700">{description}</p>
          <CategoryStrip locale={locale} activeCategory={category} />
        </section>

        {posts.length === 0 ? (
          <p className="mt-10 text-base text-ink-500">{ui.categoryEmpty}</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
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
    <div lang={ui.htmlLang} className="min-h-screen bg-paper">
      <HtmlLang lang={ui.htmlLang} />
      <BlogHeader locale={locale} switchPaths={switchPathsFor()} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(indexJsonLd).replace(/</g, "\\u003c") }}
        />
        <section className="rounded-2xl border border-mist bg-white p-6 shadow-[0_24px_70px_-55px_rgba(11,24,38,0.45)] sm:p-8 lg:grid lg:grid-cols-[1fr_0.6fr] lg:items-end lg:gap-10">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-normal text-green-700">{ui.blogEyebrow}</p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-5xl">{ui.blogTitle}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-700">{ui.blogDescription}</p>
          </div>
          <div className="mt-6 rounded-xl bg-[#f7faf8] p-4 ring-1 ring-mist lg:mt-0">
            <p className="text-sm font-extrabold text-ink-900">{ui.latestArticles}</p>
            <p className="mt-1 text-sm leading-6 text-ink-500">{ui.articleCount(posts.length)}</p>
          </div>
          <div className="lg:col-span-2">
            <CategoryStrip locale={locale} />
          </div>
        </section>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </main>
      <BlogFooter locale={locale} />
    </div>
  );
}
