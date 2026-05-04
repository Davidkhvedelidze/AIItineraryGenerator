import { popularTripIdeas } from "@/constants/popular-trip-ideas";

export function PopularTripIdeas() {
  return (
    <section aria-labelledby="popular-trip-ideas-title" className="py-16">
      <div className="container space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Georgia trip inspiration
          </p>
          <h2 id="popular-trip-ideas-title" className="text-3xl font-semibold tracking-tight">
            Popular Georgia Trip Ideas
          </h2>
          <p className="text-muted-foreground">
            Explore realistic Georgia trip ideas and use them as inspiration for your custom
            AI-generated itinerary. From a short Tbilisi city break to a Kazbegi winter trip,
            these Georgia itinerary ideas include family trip and Kakheti wine tour options.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularTripIdeas.map((idea) => (
            <article key={idea.slug} className="flex h-full flex-col rounded-lg border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{idea.duration}</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{idea.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{idea.description}</p>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Best for</p>
                  <ul className="mt-2 flex flex-wrap gap-2" aria-label={`Best for ${idea.title}`}>
                    {idea.bestFor.map((tag) => (
                      <li key={tag} className="rounded-full border px-2.5 py-1 text-xs font-medium text-foreground">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Regions</p>
                  <ul className="mt-2 flex flex-wrap gap-2" aria-label={`Regions in ${idea.title}`}>
                    {idea.regions.map((region) => (
                      <li key={region} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                        {region}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href="#trip-planner"
                className="mt-6 inline-flex w-fit items-center rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`Generate a similar trip to ${idea.title}`}
              >
                Generate Similar Trip
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
