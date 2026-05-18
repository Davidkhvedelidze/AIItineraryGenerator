import Link from "next/link";
import { getRelatedBlogPosts } from "@/lib/blog";

interface RelatedPostsProps {
  currentSlug: string;
}

export async function RelatedPosts({ currentSlug }: RelatedPostsProps) {
  const posts = await getRelatedBlogPosts(currentSlug, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Related blog posts</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-lg border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{post.category}</p>
            <h3 className="mt-2 text-lg font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:text-amber-700">
                {post.title}
              </Link>
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}
