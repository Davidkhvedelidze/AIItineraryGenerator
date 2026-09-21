import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { BlogPostListItem } from "@/types/sanity-blog";
import { formatBlogDate } from "@/lib/blog-presentation";
import { getSanityImageUrl } from "@/lib/sanity/image";
import styles from "./blog.module.css";

interface BlogCardProps {
  post: BlogPostListItem;
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}

export function BlogCard({
  post,
  featured = false,
  headingLevel = "h3",
}: BlogCardProps) {
  const imageUrl = getSanityImageUrl(post.mainImage, {
    width: featured ? 1000 : 720,
    height: featured ? 850 : 450,
    fit: "crop",
  });
  const publishedDate = formatBlogDate(post.publishedAt);
  const Heading = headingLevel;

  return (
    <article className={featured ? styles.feature : styles.card}>
      <Link
        href={`/blog/${post.slug}`}
        className={featured ? styles.featureImage : styles.cardImage}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={imageUrl || "/tbilisiHD.jpg"}
          alt={
            imageUrl ? post.title : "Tbilisi rooftops and the hills of Georgia"
          }
          fill
          priority={featured}
          sizes={
            featured
              ? "(min-width: 1280px) 620px, (min-width: 768px) 54vw, calc(100vw - 32px)"
              : "(min-width: 1280px) 365px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, calc(100vw - 32px)"
          }
          className="object-cover"
        />
      </Link>
      <div
        className={
          featured
            ? "flex flex-col justify-center p-6 sm:p-8 lg:p-12"
            : "flex flex-1 flex-col pt-5"
        }
      >
        <div
          className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium ${styles.muted}`}
        >
          {featured ? (
            <span className={`font-semibold ${styles.accent}`}>
              Latest story
            </span>
          ) : null}
          {post.category ? (
            <span
              className={
                featured ? "border-l border-current/30 pl-3" : styles.accent
              }
            >
              {post.category}
            </span>
          ) : null}
        </div>
        <Heading
          className={`mt-3 font-serif font-medium ${featured ? "text-3xl leading-[1.2] lg:text-[2.5rem]" : "text-[1.4rem] leading-snug"}`}
        >
          <Link href={`/blog/${post.slug}`} className={styles.cardTitle}>
            {post.title}
          </Link>
        </Heading>
        {post.excerpt ? (
          <p
            className={`mt-3 ${featured ? "line-clamp-4 text-base leading-7" : "line-clamp-3 text-sm leading-6"} ${styles.muted}`}
          >
            {post.excerpt}
          </p>
        ) : null}
        <div
          className={`mt-auto flex items-center justify-between gap-4 pt-6 text-xs ${styles.muted}`}
        >
          {publishedDate ? (
            <time dateTime={post.publishedAt}>{publishedDate}</time>
          ) : (
            <span>TripMate Georgia</span>
          )}
          <Link
            href={`/blog/${post.slug}`}
            aria-label={`Read guide: ${post.title}`}
            className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold ${styles.accent}`}
          >
            Read guide <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
