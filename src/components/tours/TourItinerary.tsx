import { Bed, CheckCircle2, MapPin, Utensils } from "lucide-react";
import type { TourItineraryItem } from "@/types/sanity-tour";

type TourItineraryProps = {
  items?: TourItineraryItem[];
};

export function TourItinerary({ items }: TourItineraryProps) {
  const itinerary =
    items
      ?.map((item) => ({
        ...item,
        stops: item.stops?.filter(Boolean),
      }))
      .filter((item) => item.title || item.description || item.stops?.length) ?? [];
  if (itinerary.length === 0) return null;

  return (
    <section
      id="itinerary"
      aria-labelledby="tour-itinerary-heading"
      className="scroll-mt-24 space-y-5"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Route plan
        </p>
        <h2 id="tour-itinerary-heading" className="mt-1 text-2xl font-semibold tracking-tight">
          Day-by-day itinerary
        </h2>
      </div>
      <div className="relative space-y-5 before:absolute before:bottom-4 before:left-5 before:top-4 before:w-px before:bg-border sm:before:left-6">
        {itinerary.map((item, index) => (
          <article
            key={`${item.title || "day"}-${index}`}
            className="relative grid gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:grid-cols-[2.5rem_minmax(0,1fr)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm ring-4 ring-background">
              {item.day ?? index + 1}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Day {item.day ?? index + 1}
                </p>
                {item.region ? (
                  <p className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.region}
                  </p>
                ) : null}
              </div>
              {item.title ? <h3 className="mt-2 text-xl font-semibold">{item.title}</h3> : null}
              {item.description ? (
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              ) : null}
              {item.stops && item.stops.length > 0 ? (
                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  {item.stops.map((stop) => (
                    <li key={stop} className="inline-flex gap-2 rounded-xl bg-muted px-3 py-2">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                        aria-hidden="true"
                      />
                      <span>{stop}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                {typeof item.mealsIncluded === "boolean" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1">
                    <Utensils className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                    Meals: {item.mealsIncluded ? "included" : "not included"}
                  </span>
                ) : null}
                {typeof item.accommodationIncluded === "boolean" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1">
                    <Bed className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                    Stay: {item.accommodationIncluded ? "included" : "not included"}
                  </span>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
