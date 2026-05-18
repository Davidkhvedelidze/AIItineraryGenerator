import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ToursFilterGrid } from "@/components/tours/ToursFilterGrid";
import { getAllTours } from "@/lib/tours";

export const metadata: Metadata = {
  title: "Private Tours in Georgia — TripMate Georgia",
  description:
    "Book private Georgia tours with local driver support, custom routes, direct booking, and family-friendly planning for Gulf and GCC travelers.",
  alternates: { canonical: "/tours" },
};

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <header className="max-w-4xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
              Private tours
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Private Tours in Georgia
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Explore Georgia with private routes, local driver support, and
              flexible pickup planning. These tours are designed for travelers
              who want comfort, clear communication, and practical support for
              families from the Gulf and GCC as well as independent visitors.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#trip-planner"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                Build a custom itinerary
              </Link>
              <a
                href="https://wa.me/995551181358?text=Hello%2C%20I%20would%20like%20help%20choosing%20a%20private%20Georgia%20tour."
                className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
              >
                Ask on WhatsApp
              </a>
            </div>
          </header>

          {tours.length > 0 ? (
            <ToursFilterGrid tours={tours} />
          ) : (
            <section className="rounded-lg border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight">No tours yet</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Private tours will appear here after they are published in Sanity Studio.
              </p>
            </section>
          )}

          <section className="grid gap-4 rounded-lg border bg-card p-6 shadow-sm md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Still comparing route ideas?
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Browse route inspiration and travel guides before choosing a
                tour or requesting a direct custom booking.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <Link
                href="/trip-ideas"
                className="rounded-md border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
              >
                Trip ideas
              </Link>
              <Link
                href="/blog"
                className="rounded-md border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
              >
                Travel blog
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
