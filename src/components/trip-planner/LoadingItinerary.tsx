"use client";

import { memo } from "react";
import { LoaderCircle } from "lucide-react";

function LoadingItineraryComponent() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-stone-600">
        <LoaderCircle className="h-5 w-5 animate-spin text-amber-700" aria-hidden="true" />
        <span>Creating your personalized Georgia trip...</span>
      </div>
    </div>
  );
}

export const LoadingItinerary = memo(LoadingItineraryComponent);
