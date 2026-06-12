import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allSlugs, getPost } from "@/lib/blog";
import { blogPostMetadata } from "@/lib/blog/meta";
import { BlogArticle } from "@/components/blog/BlogArticle";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return blogPostMetadata(post, "uz");
}

export default function BlogPostUz({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  return <BlogArticle post={post} locale="uz" />;
}
