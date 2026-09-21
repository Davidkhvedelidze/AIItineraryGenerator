import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FAQSection } from "@/components/seo/FAQSection";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/blog";
import {
  formatBlogDate,
  getBlogHeadings,
  getBlogReadingMinutes,
} from "@/lib/blog-presentation";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { buildFAQJsonLd } from "@/lib/seo/faqJsonLd";
import styles from "@/components/blog/blog.module.css";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Blog Post Not Found" };
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();
  const imageUrl = getSanityImageUrl(post.mainImage, {
    width: 1600,
    height: 800,
    fit: "crop",
  });
  const publishedDate = formatBlogDate(post.publishedAt, "long");
  const body = post.body || [];
  const headings = getBlogHeadings(body);
  const readingMinutes = getBlogReadingMinutes(body);
  const tags = Array.from(
    new Set((post.tags || []).map((tag) => tag.trim()).filter(Boolean)),
  );
  const faqItems =
    post.faq?.filter((item): item is { question: string; answer: string } =>
      Boolean(item.question && item.answer),
    ) ?? [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: `https://tripmategeorgia.com/blog/${post.slug}`,
    image: imageUrl ? [imageUrl] : undefined,
    author: { name: "TripMate Georgia" },
    publisher: { name: "TripMate Georgia" },
  };
  const faqJsonLd = faqItems.length > 0 ? buildFAQJsonLd(faqItems) : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className={`flex-1 ${styles.journal}`}>
        <div className="container max-w-6xl pb-16 pt-8 sm:pb-20 sm:pt-10">
          <nav
            aria-label="Breadcrumb"
            className={`mb-8 text-sm ${styles.muted}`}
          >
            <Link
              href="/blog"
              className={`inline-flex min-h-11 items-center gap-2 font-medium ${styles.accent}`}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All travel stories
            </Link>
          </nav>
          <article>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
              }}
            />
            {faqJsonLd ? (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
                }}
              />
            ) : null}
            <header className="max-w-4xl">
              {post.category ? (
                <p
                  className={`mb-4 text-xs font-semibold uppercase tracking-[.14em] ${styles.accent}`}
                >
                  {post.category}
                </p>
              ) : null}
              <h1 className="font-serif text-4xl font-medium leading-[1.14] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                {post.title}
              </h1>
              {post.excerpt ? (
                <p
                  className={`mt-5 max-w-3xl text-lg leading-8 ${styles.muted}`}
                >
                  {post.excerpt}
                </p>
              ) : null}
              <div
                className={`mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs sm:text-sm ${styles.muted}`}
              >
                <span className={`font-semibold ${styles.accent}`}>
                  By TripMate Georgia
                </span>
                {publishedDate ? (
                  <time dateTime={post.publishedAt}>{publishedDate}</time>
                ) : null}
                {readingMinutes ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    {readingMinutes} min read
                  </span>
                ) : null}
              </div>
            </header>
            <div className="relative my-9 aspect-[4/3] overflow-hidden rounded-2xl sm:my-12 sm:aspect-[2/1]">
              <Image
                src={imageUrl || "/tbilisiHD.jpg"}
                alt={
                  imageUrl
                    ? post.title
                    : "Tbilisi’s historic cityscape in Georgia"
                }
                fill
                priority
                sizes="(min-width: 1280px) 1120px, calc(100vw - 32px)"
                className="object-cover"
              />
            </div>
            <div
              className={`grid gap-10 lg:gap-16 ${headings.length > 1 ? "lg:grid-cols-[minmax(0,1fr)_250px]" : "mx-auto max-w-3xl"}`}
            >
              <BlogTableOfContents headings={headings} />
              <div className="min-w-0 space-y-12 lg:col-start-1 lg:row-start-1">
                {body.length > 0 ? (
                  <BlogPostBody body={body} title={post.title} />
                ) : null}
                {tags.length > 0 ? (
                  <div className={`border-t pt-6 ${styles.border}`}>
                    <p className={`mb-3 text-sm font-medium ${styles.muted}`}>
                      Covered in this story
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <li
                          key={tag}
                          className={`rounded-full px-3 py-1.5 text-xs ${styles.soft} ${styles.accent}`}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {faqItems.length > 0 ? <FAQSection items={faqItems} /> : null}
              </div>
            </div>
            <div className="mt-16">
              <BlogCTA cta={post.cta} />
            </div>
          </article>
          <div className="mt-16 sm:mt-20">
            <RelatedPosts currentSlug={post.slug} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
