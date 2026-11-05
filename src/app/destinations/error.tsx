"use client";

import { RouteError } from "@/components/layout/RouteError";

export default function DestinationsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      title="Unable to load destinations"
      description="We couldn't load our destination guides right now. Please try again in a moment."
      reset={reset}
    />
  );
}
