import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Georgia Travel Blog — TripMate Georgia",
  description:
    "Read practical Georgia travel guides, itinerary tips, wine tour advice, Kazbegi route notes, and month-by-month planning tips.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Travel insights</p>
            <h1 className="text-4xl font-semibold tracking-tight">Georgia Travel Blog</h1>
            <p className="text-muted-foreground">
              Practical Georgia travel guides to help you plan realistic routes, choose the best
              season, and create a better custom itinerary.
            </p>
          </header>

          <section className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </section>

          <BlogCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
