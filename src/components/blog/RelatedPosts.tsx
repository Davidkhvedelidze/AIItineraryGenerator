import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedBlogPosts } from "@/lib/blog";
import { BlogCard } from "./BlogCard";
import styles from "./blog.module.css";

export async function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const posts = await getRelatedBlogPosts(currentSlug, 3);
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="related-posts-heading">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2
          id="related-posts-heading"
          className="font-serif text-3xl font-medium sm:text-4xl"
        >
          Keep exploring Georgia
        </h2>
        <Link
          href="/blog"
          className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold ${styles.accent}`}
        >
          All travel stories
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
