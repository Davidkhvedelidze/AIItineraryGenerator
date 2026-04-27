"use client";

import { memo } from "react";
import { LoaderCircle } from "lucide-react";

function LoadingItineraryComponent() {
  return (
    <div className="rounded-lg border bg-card p-6" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
        <span>Creating your personalized Georgia trip...</span>
      </div>
    </div>
  );
}

export const LoadingItinerary = memo(LoadingItineraryComponent);
