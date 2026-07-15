"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteSignature } from "@/components/motion/RouteSignature";

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
      className="scroll-mt-24  bg-[hsl(42_48%_96%/0.78)] py-12 md:py-16"
    >
      <div className="container scale-90">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-yellow-900/10"
        >
          <div className="grid gap-0 lg:grid-cols-[0.78fr_1fr]">
            <div className="relative overflow-hidden bg-[#F5B700] p-6 text-stone-950 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/25 px-3 py-1 text-sm font-semibold text-stone-950">
                <Sparkles
                  className="h-4 w-4 text-amber-800"
                  aria-hidden="true"
                />
                The itinerary builder, live
              </div>
              <h2 className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                This is the AI that plans your Georgia trip.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-950 sm:text-base">
                Share your dates, interests, group size, travel pace, pickup,
                and route preferences. It drafts a realistic day-by-day route in
                seconds, one you can still refine with local support.
              </p>

              <div className="mt-6 rounded-2xl border border-black/15 bg-black/10 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-stone-800">
                  <span>Sample output</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-stone-800/60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-stone-800" />
                    </span>
                    Generating
                  </span>
                </div>
                <RouteSignature className="mt-2 h-28 w-full" dark={false} />
              </div>

              <div className="mt-4 rounded-2xl border border-black/15 bg-white/25 p-4 text-sm leading-6 text-stone-950">
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

              <motion.div
                whileTap={{ scale: 0.98 }}
                className="mt-5 inline-block"
              >
                <Button
                  type="button"
                  className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-hover"
                  onClick={onLoad}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading planner..." : "Start My Itinerary"}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function DeferredTripPlanner() {
  return <TripPlanner />;
}
