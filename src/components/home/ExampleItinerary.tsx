import { BadgeCheck, Car, Clock, MapPin, Route, Utensils } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const itineraryDays = [
  {
    day: "Day 1",
    title: "Tbilisi arrival and Old Town",
    route: "Airport pickup, Narikala, sulfur baths, dinner in Sololaki",
    tag: "Soft landing",
  },
  {
    day: "Day 2",
    title: "Mtskheta and Kakheti wine country",
    route: "Jvari, Svetitskhoveli, Sighnaghi viewpoints, family wine cellar",
    tag: "Heritage",
  },
  {
    day: "Day 3",
    title: "Kazbegi mountain road",
    route: "Zhinvali, Ananuri, Gudauri viewpoint, Gergeti Trinity Church",
    tag: "Mountains",
  },
  {
    day: "Day 4",
    title: "Food, markets, and flexible support",
    route: "Dry Bridge Market, Georgian cooking stop, optional private guide",
    tag: "Local flavor",
  },
];

const previewBenefits = [
  { label: "Day-by-day timing", icon: Clock },
  { label: "Road-aware route logic", icon: Route },
  { label: "Private driver notes", icon: Car },
  { label: "Local food stops", icon: Utensils },
];

export function ExampleItinerary() {
  return (
    <section className="bg-white/55 py-12 md:py-16">
      <div className="container grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
        <ScrollReveal className="lg:sticky lg:top-24">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
            Route preview
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
            The plan reads like a real Georgia route, not a generic list
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
            Each itinerary balances scenery, driving time, meals, hotel rhythm,
            and local support so travelers can understand what the trip will
            actually feel like.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {previewBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.label}
                  className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {benefit.label}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal
          delay={0.15}
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-yellow-900/10"
        >
          <div className="border-b border-yellow-200 bg-[#F5B700] p-5 text-stone-950 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                  Sample route
                </p>
                <h3 className="mt-2 font-serif text-3xl font-semibold tracking-normal">
                  4 days: Tbilisi, wine, mountains
                </h3>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-black/15 bg-white/25 px-3 py-1 text-sm font-semibold text-stone-950">
                <MapPin className="h-4 w-4 text-amber-800" aria-hidden="true" />
                Tbilisi base
              </span>
            </div>
          </div>

          <div className="divide-y divide-stone-200">
            {itineraryDays.map((item) => (
              <article
                key={item.day}
                className="grid gap-4 p-5 transition hover:bg-stone-50/70 sm:grid-cols-[90px_1fr_auto] sm:items-start"
              >
                <div className="font-serif text-2xl font-semibold text-amber-700">
                  {item.day}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    {item.route}
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.tag}
                </span>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
