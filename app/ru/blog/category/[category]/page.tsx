import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/blog";
import type { BlogCategory } from "@/lib/blog/types";
import { blogCategoryMetadata } from "@/lib/blog/meta";
import { BlogCategoryIndex } from "@/components/blog/BlogArticle";

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ category }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  if (!BLOG_CATEGORIES.includes(params.category as BlogCategory)) return {};
  return blogCategoryMetadata("ru", params.category as BlogCategory);
}

export default function BlogCategoryRu({ params }: { params: { category: string } }) {
  if (!BLOG_CATEGORIES.includes(params.category as BlogCategory)) notFound();
  return <BlogCategoryIndex category={params.category as BlogCategory} locale="ru" />;
}
