import type { Metadata } from "next";
import { POSTS } from "@/lib/blog";
import { blogIndexMetadata } from "@/lib/blog/meta";
import { BlogIndex } from "@/components/blog/BlogArticle";

export const metadata: Metadata = blogIndexMetadata("uz");

export default function BlogIndexUz() {
  return <BlogIndex posts={POSTS} locale="uz" />;
}
