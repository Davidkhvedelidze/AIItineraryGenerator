"use client";

import { TripPlannerForm } from "./TripPlannerForm";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { LoadingItinerary } from "./LoadingItinerary";
import { ErrorMessage } from "./ErrorMessage";
import { ItineraryResult } from "./ItineraryResult";

export function TripPlanner() {
  const { status, data, error, generateItinerary, reset } = useItineraryGenerator();

  return (
    <section id="trip-planner" className="scroll-mt-20 py-16">
      <div className="container space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Build your trip plan</h2>
          <p className="text-muted-foreground">Answer a few questions and we&apos;ll generate your personalized itinerary.</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <TripPlannerForm isLoading={status === "loading"} onSubmit={generateItinerary} />
        </div>

        {status === "loading" && <LoadingItinerary />}
        {status === "error" && error && <ErrorMessage message={error} onReset={reset} />}
        {status === "success" && data && <ItineraryResult result={data} onReset={reset} />}
      </div>
    </section>
  );
}
