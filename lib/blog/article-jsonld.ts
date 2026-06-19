import type { BlogLocale, BlogPost } from "./types";
import { BLOG_UI, blogIndexPath, blogPostPath, landingPath } from "./i18n";

const SITE = "https://birliy.uz";

// Pure builder for a blog article's JSON-LD @graph (BlogPosting + FAQPage +
// BreadcrumbList). Extracted from BlogArticle so the structured-data shape can
// be unit-tested deterministically. Output is identical to the inline version.
export function articleJsonLd(post: BlogPost, locale: BlogLocale) {
  const ui = BLOG_UI[locale];
  const c = post.locales[locale];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${SITE}${blogPostPath(locale, post.slug)}#article`,
        headline: c.title,
        description: c.description,
        keywords: c.keywords.join(", "),
        datePublished: post.date,
        dateModified: post.modified ?? post.date,
        inLanguage: ui.htmlLang,
        mainEntityOfPage: `${SITE}${blogPostPath(locale, post.slug)}`,
        image: post.image
          ? [post.image.square, post.image.landscape, post.image.wide]
          : `${SITE}/photos/blog/birliy-og.jpg`,
        author: { "@type": "Organization", "@id": `${SITE}/#organization`, name: "BirLiy", url: SITE },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE}/#organization`,
          name: "BirLiy",
          url: SITE,
          logo: { "@type": "ImageObject", url: `${SITE}/birliy-wordmark.png` },
        },
        citation: c.sources?.map((source) => source.url),
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
}
