import Link from "next/link";
import Image from "next/image";
import type { BlogPostListItem } from "@/types/sanity-blog";
import { urlFor } from "@/lib/sanity/image";

interface BlogCardProps {
  post: BlogPostListItem;
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage)
        .width(720)
        .height(405)
        .fit("crop")
        .auto("format")
        .url()
    : null;
  const publishedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(post.publishedAt))
    : null;

  return (
    <article className="overflow-hidden rounded-lg border bg-card shadow-sm transition hover:shadow-md">
      {imageUrl ? (
        <Link href={`/blog/${post.slug}`} className="block">
          <Image
            src={imageUrl}
            alt={post.title}
            width={720}
            height={405}
            sizes="(min-width: 1024px) 448px, (min-width: 640px) 50vw, calc(100vw - 32px)"
            className="aspect-[16/9] w-full object-cover"
          />
        </Link>
      ) : null}
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-primary">
          {post.category ? <span>{post.category}</span> : null}
          {publishedDate ? <time className="text-muted-foreground">{publishedDate}</time> : null}
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p> : null}
        {post.tags && post.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
