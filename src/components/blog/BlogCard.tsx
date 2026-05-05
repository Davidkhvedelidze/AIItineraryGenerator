import Link from "next/link";
import type { BlogPost } from "@/constants/blog-posts";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wide text-primary">
        <span>{post.category}</span>
        <span className="text-muted-foreground">{post.readingTime}</span>
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        <Link href={`/blog/${post.slug}`} className="hover:text-primary">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
