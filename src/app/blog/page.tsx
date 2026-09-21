import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getAllBlogPosts } from "@/lib/blog";
import styles from "@/components/blog/blog.module.css";

export const metadata: Metadata = {
  title: "Georgia Travel Blog — TripMate Georgia",
  description:
    "Read practical Georgia travel guides, itinerary tips, wine tour advice, Kazbegi route notes, and month-by-month planning tips.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const featuredPost = posts[0];
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className={`flex-1 ${styles.journal}`}>
        <div className="container max-w-6xl pb-16 pt-10 sm:pb-20 sm:pt-14">
          <header className="mb-9 max-w-3xl sm:mb-12">
            <p
              className={`mb-4 text-xs font-semibold uppercase tracking-[.18em] ${styles.accent}`}
            >
              The TripMate journal
            </p>
            <h1 className="font-serif text-[2.75rem] font-medium leading-[1.1] tracking-tight sm:text-6xl">
              Georgia Travel Blog
            </h1>
            <p
              className={`mt-5 max-w-xl text-base leading-7 sm:text-lg ${styles.muted}`}
            >
              Local stories, thoughtful routes, and practical advice for a trip
              that feels like you.
            </p>
          </header>
          {featuredPost ? (
            <>
              <BlogCard post={featuredPost} featured headingLevel="h2" />
              <div className="mt-14 sm:mt-20">
                <BlogExplorer
                  items={posts.map((post) => ({
                    id: post._id || post.slug,
                    category: post.category?.trim() || "",
                    searchText: [
                      post.title,
                      post.excerpt,
                      post.category,
                      ...(post.tags || []),
                    ]
                      .filter(Boolean)
                      .join(" ")
                      .toLocaleLowerCase(),
                    card: <BlogCard post={post} />,
                  }))}
                />
              </div>
            </>
          ) : (
            <section
              className={`rounded-2xl border p-8 sm:p-12 ${styles.border} ${styles.soft}`}
            >
              <h2 className="font-serif text-3xl">
                New stories are on their way
              </h2>
              <p className={`mt-3 max-w-lg leading-7 ${styles.muted}`}>
                We’re gathering more local tips and travel guides. In the
                meantime, find a route for your next Georgia adventure.
              </p>
              <Link
                href="/trip-ideas"
                className={`mt-6 ${styles.secondaryButton}`}
              >
                Browse trip ideas
              </Link>
            </section>
          )}
          <div className="mt-16 sm:mt-20">
            <BlogCTA />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
