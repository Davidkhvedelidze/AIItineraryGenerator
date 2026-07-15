"use client";

import { RouteError } from "@/components/layout/RouteError";

export default function TourError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      title="Unable to load this tour"
      description="We couldn't load this tour's details right now. Please try again in a moment."
      reset={reset}
    />
  );
}
