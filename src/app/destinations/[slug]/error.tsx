"use client";

import { RouteError } from "@/components/layout/RouteError";

export default function DestinationError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      title="Unable to load this destination"
      description="We couldn't load this destination guide right now. Please try again in a moment."
      reset={reset}
    />
  );
}
