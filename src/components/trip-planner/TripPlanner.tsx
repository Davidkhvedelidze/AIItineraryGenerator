"use client";

import { TripPlannerForm } from "./TripPlannerForm";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { ErrorMessage } from "./ErrorMessage";
import { ItineraryResult } from "./ItineraryResult";

export function TripPlanner() {
  const { status, data, formData, error, generateItinerary, reset } = useItineraryGenerator();

  return (
    <section id="trip-planner" className="scroll-mt-20 bg-gradient-to-b from-background via-emerald-50/80 to-background py-16">
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
