"use client";

import { TripPlannerForm } from "./TripPlannerForm";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { ErrorMessage } from "./ErrorMessage";
import { ItineraryResult } from "./ItineraryResult";
import { ShieldCheck } from "lucide-react";

export function TripPlanner() {
  const { status, data, formData, error, generateItinerary, reset } = useItineraryGenerator();

  return (
    <section
      id="trip-planner"
      className="scroll-mt-24 bg-[hsl(42_48%_96%/0.78)] py-12 md:py-16"
    >
      <div className="container space-y-7">
        <div className="grid gap-5 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-amber-700" aria-hidden="true" />
              Georgia itinerary builder
            </div>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
              Build a route around your pace, people, and pickup details
            </h2>
          </div>
          <p className="text-sm leading-7 text-stone-600 sm:text-base lg:max-w-2xl">
            Answer a few questions about dates, interests, group size, pace,
            pickup, and route preferences. You can review the plan, download it,
            or request local booking support.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xl shadow-yellow-900/10 md:p-6">
          <TripPlannerForm isLoading={status === "loading"} onSubmit={generateItinerary} />
        </div>

        {status === "error" && error && <ErrorMessage message={error} onReset={reset} />}
        {status === "success" && data && formData && (
          <ItineraryResult result={data} formData={formData} onReset={reset} />
        )}
      </div>
    </section>
  );
}
