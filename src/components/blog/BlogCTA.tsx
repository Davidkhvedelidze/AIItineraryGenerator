import Link from "next/link";

export function BlogCTA() {
  return (
    <section className="rounded-xl border bg-card p-8 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight">Plan your own Georgia trip</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Use TripMate Georgia to generate a custom day-by-day itinerary based on your dates,
        budget, interests, and group size.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/#trip-planner" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Generate Custom Itinerary</Link>
        <Link href="/trip-ideas" className="rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15">Explore Trip Ideas</Link>
      </div>
    </section>
  );
}
