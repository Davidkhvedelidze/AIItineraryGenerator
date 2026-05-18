"use client";

import { useMemo, useState } from "react";
import type { TourListItem } from "@/types/sanity-tour";
import { TourCard } from "@/components/tours/TourCard";

type ToursFilterGridProps = {
  tours: TourListItem[];
};

export function ToursFilterGrid({ tours }: ToursFilterGridProps) {
  const [activeRegion, setActiveRegion] = useState("All");
  const regions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(tours.flatMap((tour) => tour.regions ?? []))).sort(),
    ],
    [tours],
  );
  const filteredTours =
    activeRegion === "All"
      ? tours
      : tours.filter((tour) => tour.regions?.includes(activeRegion));

  return (
    <section className="space-y-5" aria-labelledby="tour-grid-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="tour-grid-heading" className="text-2xl font-semibold tracking-tight">
          Available private tours
        </h2>
        {regions.length > 1 ? (
          <div className="flex flex-wrap gap-2" aria-label="Filter tours by region">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegion(region)}
                className={
                  activeRegion === region
                    ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                    : "rounded-full border px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-primary-soft hover:text-foreground"
                }
              >
                {region}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredTours.map((tour) => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </div>
    </section>
  );
}
