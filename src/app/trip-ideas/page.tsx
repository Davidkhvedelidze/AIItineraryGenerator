import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { popularTripIdeas } from "@/constants/popular-trip-ideas";

export const metadata: Metadata = {
  title: "Trip Ideas for Georgia",
  description:
    "Browse SEO-friendly Georgia trip ideas with durations, highlights, and route suggestions for first-time visitors, families, and couples.",
  alternates: {
    canonical: "/trip-ideas",
  },
};

export default function TripIdeasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Trip inspiration</p>
            <h1 className="text-4xl font-semibold tracking-tight">Popular Georgia Trip Ideas</h1>
            <p className="text-muted-foreground">
              Compare ready-made Georgia route ideas and open each one for highlights, day-by-day
              itinerary, and practical travel tips.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2">
            {popularTripIdeas.map((idea) => (
              <article key={idea.slug} className="rounded-lg border bg-card p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{idea.duration}</p>
                <h2 className="mt-2 text-xl font-semibold">{idea.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{idea.description}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Best time:</span> {idea.bestTimeToVisit}
                </p>
                <Link
                  href={`/trip-ideas/${idea.slug}`}
                  className="mt-5 inline-flex w-fit items-center rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
                >
                  View trip details
                </Link>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
