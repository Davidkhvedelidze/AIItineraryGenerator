import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/blog";
import { urlFor } from "@/lib/sanity/image";

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

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage)
        .width(1200)
        .height(675)
        .fit("crop")
        .auto("format")
        .url()
    : null;
  const publishedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
        new Date(post.publishedAt),
      )
    : null;
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-4">
        <article className="mx-auto max-w-4xl space-y-10">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <header className="space-y-4">
            {post.category ? (
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {post.category}
              </p>
            ) : null}
            <h1 className="text-4xl font-semibold tracking-tight">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="text-lg leading-8 text-muted-foreground">
                {post.excerpt}
              </p>
            ) : null}
            {publishedDate ? (
              <time
                className="block text-sm font-medium text-muted-foreground"
                dateTime={post.publishedAt}
              >
                {publishedDate}
              </time>
            ) : null}
            {post.tags && post.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              width={1200}
              height={675}
              priority
              sizes="(min-width: 1024px) 896px, calc(100vw - 32px)"
              className="aspect-[16/9] w-full rounded-lg object-cover"
            />
          ) : null}

          {post.body && post.body.length > 0 ? (
            <section className="space-y-6 text-base leading-8 text-muted-foreground">
              <PortableText
                value={post.body}
                components={{
                  block: {
                    h2: ({ children }) => (
                      <h2 className="pt-4 text-2xl font-semibold tracking-tight text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="pt-2 text-xl font-semibold text-foreground">
                        {children}
                      </h3>
                    ),
                    normal: ({ children }) => <p>{children}</p>,
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc space-y-2 pl-6">{children}</ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal space-y-2 pl-6">
                        {children}
                      </ol>
                    ),
                  },
                  listItem: {
                    bullet: ({ children }) => <li>{children}</li>,
                    number: ({ children }) => <li>{children}</li>,
                  },
                  types: {
                    image: ({ value }) => {
                      const inlineImageUrl = value
                        ? urlFor(value)
                            .width(1000)
                            .fit("max")
                            .auto("format")
                            .url()
                        : null;

                      return inlineImageUrl ? (
                        <Image
                          src={inlineImageUrl}
                          alt=""
                          width={1000}
                          height={650}
                          sizes="(min-width: 1024px) 896px, calc(100vw - 32px)"
                          className="my-8 w-full rounded-lg object-cover"
                        />
                      ) : null;
                    },
                  },
                  marks: {
                    link: ({ children, value }) => {
                      const href =
                        typeof value?.href === "string" ? value.href : "";
                      const isExternal = href.startsWith("http");

                      return (
                        <a
                          href={href}
                          className="font-medium text-primary underline-offset-4 hover:underline"
                          rel={isExternal ? "noreferrer" : undefined}
                          target={isExternal ? "_blank" : undefined}
                        >
                          {children}
                        </a>
                      );
                    },
                  },
                }}
              />
            </section>
          ) : null}

          <section className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create your Georgia itinerary
            </h2>
            <p className="mt-3 text-muted-foreground">
              Turn this guide into a realistic route with the free TripMate
              Georgia itinerary builder, or compare ready-made trip ideas first.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/#trip-planner"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Build itinerary
              </Link>
              <Link
                href="/trip-ideas"
                className="rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
              >
                View trip ideas
              </Link>
            </div>
          </section>

          <RelatedPosts currentSlug={post.slug} />
          <BlogCTA />
        </article>
      </main>
      <Footer />
    </div>
  );
}
