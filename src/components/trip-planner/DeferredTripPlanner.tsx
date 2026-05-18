"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, MapPin, ShieldCheck, Users } from "lucide-react";
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

const previewItems = [
  {
    title: "Trip basics",
    description: "Dates, airports, tour type, and travelers.",
    icon: CalendarDays,
  },
  {
    title: "Route preferences",
    description: "Overnight cities, regions, interests, and pace.",
    icon: MapPin,
  },
  {
    title: "Local support",
    description: "Pickup, family needs, timing, and booking notes.",
    icon: Users,
  },
];

function TripPlannerPlaceholder({
  isLoading = false,
  onLoad,
}: TripPlannerPlaceholderProps) {
  return (
    <section
      id="trip-planner"
      className="scroll-mt-24 bg-[hsl(42_48%_96%/0.78)] py-12 md:py-16"
    >
      <div className="container">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-yellow-900/10">
          <div className="grid gap-0 lg:grid-cols-[0.78fr_1fr]">
            <div className="bg-[#F5B700] p-6 text-stone-950 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/25 px-3 py-1 text-sm font-semibold text-stone-950">
                <ShieldCheck className="h-4 w-4 text-amber-800" aria-hidden="true" />
                Itinerary builder
              </div>
              <h2 className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Tell us the trip. Get a route you can actually use.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-950 sm:text-base">
                Share your dates, interests, group size, travel pace, pickup,
                and route preferences. The planner creates a realistic Georgia
                itinerary you can refine with local support.
              </p>
              <div className="mt-6 rounded-2xl border border-black/15 bg-white/25 p-4 text-sm leading-6 text-stone-950">
                Free itinerary preview first. Booking support is optional after
                you review the plan.
              </div>
            </div>

            <div className="p-5 md:p-6 lg:p-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {previewItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="mt-4 text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-stone-600">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-600">
                Built for first-time visitors, families, Gulf travelers, and
                private groups who want beautiful days without unrealistic
                transfer plans.
              </div>

              <Button
                type="button"
                className="mt-5 h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-hover"
                onClick={onLoad}
                disabled={isLoading}
              >
                {isLoading ? "Loading planner..." : "Start Itinerary"}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
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
