"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TripPlannerForm } from "./TripPlannerForm";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { ErrorMessage } from "./ErrorMessage";
import { ItineraryResult } from "./ItineraryResult";
import { RouteSignature } from "../motion/RouteSignature";
import { motion } from "framer-motion";
import { GenerationLoadingModal } from "./form/GenerationLoadingModal";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function TripPlanner() {
  const router = useRouter();
  const {
    status,
    data,
    formData,
    error,
    shareId,
    generateItinerary,
    reset,
    cancelGeneration,
  } = useItineraryGenerator();

  useEffect(() => {
    if (status === "success" && shareId) {
      router.push(`/itinerary/${shareId}`);
    }
  }, [status, shareId, router]);

  // Falls back to inline rendering only when persistence failed (no shareId),
  // so a Supabase outage never loses the user's generated trip.
  const showInlineFallback =
    status === "success" && data && formData && !shareId;

  return (
    <section
      id="trip-planner"
      className="scroll-mt-24  bg-[hsl(42_48%_96%/0.78)] py-12 md:py-4"
    >
      <div className="container  scale-90">
        <div className=" w-full flex justify-between">
          <h2 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
            Tell us your dates, interests, and group size — get a real Georgia
            route in minutes
          </h2>
          <motion.div variants={fadeUp} className="hidden sm:flex">
            <RouteSignature className="h-[150px]  " />
          </motion.div>
        </div>

        <TripPlannerForm
          onSubmit={generateItinerary}
          isLoading={status === "loading"}
        />

        {status === "error" && error && (
          <ErrorMessage message={error} onReset={reset} />
        )}
        {showInlineFallback && data && formData && (
          <ItineraryResult result={data} formData={formData} onReset={reset} />
        )}
      </div>
      <GenerationLoadingModal
        isOpen={status === "loading"}
        onCancel={cancelGeneration}
      />
    </section>
  );
}
