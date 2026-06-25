import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";
import { getSeoKeywordPage, seoKeywordMetadata, seoKeywordPagesForLocale } from "@/lib/seo/keyword-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return seoKeywordPagesForLocale("ru").map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getSeoKeywordPage("ru", params.slug);
  if (!page) return {};
  return seoKeywordMetadata(page);
}

export default function RussianSeoKeywordPage({ params }: { params: { slug: string } }) {
  const page = getSeoKeywordPage("ru", params.slug);
  if (!page) notFound();
  return <SeoKeywordLanding page={page} />;
}
