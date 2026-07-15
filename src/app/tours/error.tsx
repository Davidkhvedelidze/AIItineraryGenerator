"use client";

import { RouteError } from "@/components/layout/RouteError";

export default function ToursError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      title="Unable to load tours"
      description="We couldn't load private tours right now. Please try again in a moment."
      reset={reset}
    />
  );
}
