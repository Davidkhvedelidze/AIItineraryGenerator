"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { printItinerary } from "@/lib/itinerary/printItinerary";
import type { ItineraryResult } from "@/types/trip";

export function DownloadPdfButton({ result, className }: { result: ItineraryResult; className?: string }) {
  function handleClick() {
    trackEvent("itinerary_pdf_download_click", {
      trip_title: result.tripTitle,
      days: result.days?.length ?? 0,
    });
    printItinerary(result);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} className={className}>
      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
      Download / Print PDF
    </Button>
  );
}
