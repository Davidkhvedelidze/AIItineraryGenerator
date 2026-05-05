import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { blogPosts } from "@/constants/blog-posts";
import { getBlogPostBySlug } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) return { title: "Blog Post Not Found" };

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: `https://tripmategeorgia.com/blog/${post.slug}`,
    author: { name: "TripMate Georgia" },
    publisher: { name: "TripMate Georgia" },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-12">
        <article className="mx-auto max-w-4xl space-y-10">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <header className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{post.heroEyebrow}</p>
            <h1 className="text-4xl font-semibold tracking-tight">{post.heroTitle}</h1>
            <p className="text-lg text-muted-foreground">{post.heroDescription}</p>
          </header>

          <section className="space-y-8">
            {post.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="leading-7 text-muted-foreground">{paragraph}</p>
                ))}
              </section>
            ))}
          </section>

          {post.faq && post.faq.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
              {post.faq.map((faqItem) => (
                <div key={faqItem.question} className="rounded-lg border bg-card p-5">
                  <h3 className="font-semibold">{faqItem.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faqItem.answer}</p>
                </div>
              ))}
            </section>
          ) : null}

          {post.relatedTripIdeas && post.relatedTripIdeas.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">Related trip ideas</h2>
              <ul className="space-y-2">
                {post.relatedTripIdeas.map((idea) => (
                  <li key={idea.href}>
                    <Link href={idea.href} className="font-medium text-primary hover:underline">{idea.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <RelatedPosts currentSlug={post.slug} />
          <BlogCTA />
        </article>
      </main>
      <Footer />
    </div>
  );
}
