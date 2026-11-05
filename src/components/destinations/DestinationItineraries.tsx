import { Clock3 } from "lucide-react";
import styles from "@/components/blog/blog.module.css";
import type { DestinationSampleItinerary } from "@/types/sanity-destination";

export function DestinationItineraries({ itineraries }: { itineraries: DestinationSampleItinerary[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {itineraries.map((itinerary) => {
        const stops = itinerary.stops?.filter((stop) => stop?.trim()) ?? [];

        return (
          <article key={itinerary._key} className={`rounded-2xl border p-5 sm:p-6 ${styles.border}`}>
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              {itinerary.title ? (
                <h3 className="font-serif text-xl font-medium leading-snug">{itinerary.title}</h3>
              ) : null}
              {itinerary.duration ? (
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles.soft} ${styles.accent}`}
                >
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {itinerary.duration}
                </span>
              ) : null}
            </div>
            {stops.length > 0 ? (
              <ol className="mt-4 space-y-2 text-sm">
                {stops.map((stop, index) => (
                  <li key={`${stop}-${index}`} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${styles.soft} ${styles.accent}`}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 break-words">{stop}</span>
                  </li>
                ))}
              </ol>
            ) : null}
            {itinerary.description ? (
              <p className={`mt-4 text-sm leading-7 ${styles.muted}`}>{itinerary.description}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
