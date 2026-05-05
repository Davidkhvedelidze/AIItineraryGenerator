"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TripPlanner = dynamic(
  () => import("./TripPlanner").then((module) => module.TripPlanner),
  {
    ssr: false,
    loading: () => <TripPlannerPlaceholder isLoading />,
  },
);

interface TripPlannerPlaceholderProps {
  isLoading?: boolean;
  onLoad?: () => void;
}

function TripPlannerPlaceholder({ isLoading = false, onLoad }: TripPlannerPlaceholderProps) {
  return (
    <section
      id="trip-planner"
      className="scroll-mt-20 bg-gradient-to-b from-background via-emerald-50/80 to-background py-16"
    >
      <div className="container space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Free itinerary builder
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Build your Georgia trip plan
          </h2>
          <p className="text-muted-foreground">
            Answer a few questions and get a realistic route you can review,
            download, or send to a local travel expert for booking help.
          </p>
        </div>

        <div className="rounded-lg border bg-card/95 p-5 shadow-lg shadow-emerald-950/10 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border bg-background p-4">
              <p className="text-sm font-semibold">Trip basics</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Dates, airports, tour type, and travelers.
              </p>
            </div>
            <div className="rounded-md border bg-background p-4">
              <p className="text-sm font-semibold">Travel preferences</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Interests, budget, pace, cities, and language.
              </p>
            </div>
          </div>
          <Button
            type="button"
            className="mt-6 h-11 px-6"
            onClick={onLoad}
            disabled={isLoading}
          >
            {isLoading ? "Loading planner..." : "Start free itinerary"}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function DeferredTripPlanner() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad || !wrapperRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "480px 0px" },
    );

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={wrapperRef}>
      {shouldLoad ? (
        <TripPlanner />
      ) : (
        <TripPlannerPlaceholder onLoad={() => setShouldLoad(true)} />
      )}
    </div>
  );
}
