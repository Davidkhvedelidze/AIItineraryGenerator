import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MapPin } from "lucide-react";
import { popularTripIdeas } from "@/constants/popular-trip-ideas";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const defaultImage = {
  src: "https://pohcdn.com/sites/default/files/styles/node__blog_post__bp_banner/public/hero_banner/Tbilisi-old-town-2.jpg",
  alt: "Tbilisi old town and the Kura River at night",
};

const kazbegiImage = {
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Kazbegi%2C_Gergeti_Trinity_Church_and_Mt_Kazbek_%2835959311351%29.jpg/1280px-Kazbegi%2C_Gergeti_Trinity_Church_and_Mt_Kazbek_%2835959311351%29.jpg",
  alt: "Gergeti Trinity Church and Mount Kazbek in Georgia",
};

const ideaImages: Record<string, { src: string; alt: string }> = {
  "3-days-in-georgia": defaultImage,
  "5-days-tbilisi-kazbegi-kakheti": kazbegiImage,
  "7-days-georgia-highlights": kazbegiImage,
  "family-trip-in-georgia": {
    src: "https://images.squarespace-cdn.com/content/v1/57b9b98a29687f1ef5c622df/1472766619420-WA3W3CNE4OVGEB3PA5IZ/Tbilisi+at+night.jpg?format=500w",
    alt: "Tbilisi at night beside the Kura River",
  },
  "wine-tour-in-kakheti": {
    src: "https://www.civitatis.com/f/georgia/tiflis/tour-kajetia-degustacion-vino-589x392.jpg",
    alt: "Evening city lights in Tbilisi before a Kakheti wine trip",
  },
  "winter-trip-gudauri-kazbegi": kazbegiImage,
};

export function PopularTripIdeas() {
  const ideas = popularTripIdeas.slice(0, 6);
  if (ideas.length === 0) return null;

  return (
    <section
      aria-labelledby="popular-trip-ideas-title"
      className="bg-[hsl(42_48%_96%/0.72)] py-12 md:py-16"
    >
      <div className="container space-y-8">
        <ScrollReveal className="grid gap-5 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              Georgia route collection
            </p>
            <h2
              id="popular-trip-ideas-title"
              className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl"
            >
              Start from a route that already understands the country
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Browse practical Georgia ideas with realistic pacing, family-ready
            stops, private tour potential, and clear next steps into the custom
            itinerary builder.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-3">
          {ideas.map((idea, index) => {
            const image = ideaImages[idea.slug] || defaultImage;
            const regions = idea.regions.filter(Boolean).slice(0, 3);
            const tags = idea.bestFor.filter(Boolean).slice(0, 3);
            const isFeatured = index === 0;

            return (
              <article
                key={idea.slug}
                className={cn(
                  "group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-900/10",
                  isFeatured &&
                    "lg:col-span-2 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)]",
                )}
              >
                <Link
                  href={`/trip-ideas/${idea.slug}`}
                  className={cn(
                    "relative block aspect-[4/3] overflow-hidden bg-muted",
                    isFeatured && "lg:aspect-auto lg:min-h-[360px]",
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={
                      isFeatured
                        ? "(min-width: 1024px) 42vw, calc(100vw - 32px)"
                        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, calc(100vw - 32px)"
                    }
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/35" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                    {idea.duration}
                  </span>
                </Link>

                <div className="flex h-full flex-col p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    Trip idea
                  </div>
                  <h3
                    className={cn(
                      "mt-3 font-serif font-semibold leading-tight tracking-normal text-foreground",
                      isFeatured ? "text-3xl" : "text-2xl",
                    )}
                  >
                    <Link
                      href={`/trip-ideas/${idea.slug}`}
                      className="hover:text-amber-700"
                    >
                      {idea.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                    {idea.description}
                  </p>

                  {regions.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {regions.map((region) => (
                        <span
                          key={region}
                          className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-foreground ring-1 ring-primary/20"
                        >
                          <MapPin
                            className="h-3 w-3 text-amber-700"
                            aria-hidden="true"
                          />
                          {region}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <Link
                      href={`/trip-ideas/${idea.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-stone-50"
                    >
                      View idea
                    </Link>
                    <Link
                      href="/#trip-planner"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
                      aria-label={`Plan a similar trip to ${idea.title}`}
                    >
                      Plan similar trip
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <ScrollReveal className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-stone-600">
            Prefer something ready-made? Browse private tours and request direct
            booking support for pickup, timing, and route details.
          </p>
          <Link
            href="/tours"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
          >
            Browse Tours
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
