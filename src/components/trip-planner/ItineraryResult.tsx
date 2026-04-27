"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { ItineraryResult as ItineraryResultType } from "@/types/trip";
import { ItineraryDayCard } from "./ItineraryDayCard";

interface ItineraryResultProps {
  result: ItineraryResultType;
  onReset: () => void;
}

export function ItineraryResult({ result, onReset }: ItineraryResultProps) {
  const summary = useMemo(
    () => [
      { title: "Estimated Budget", items: [result.estimatedBudget] },
      { title: "Best For", items: result.bestFor },
      { title: "Packing Tips", items: result.packingTips },
      { title: "Transport Tips", items: result.transportTips },
      { title: "Local Food To Try", items: result.localFoodToTry }
    ],
    [result]
  );

  return (
    <section className="space-y-6" aria-live="polite">
      <header className="rounded-lg border bg-card p-6">
        <h3 className="text-2xl font-semibold">{result.tripTitle}</h3>
        <p className="mt-2 text-muted-foreground">{result.overview}</p>
      </header>

      <div className="space-y-4">
        {result.days.map((day) => (
          <ItineraryDayCard key={day.day} dayData={day} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {summary.map((section) => (
          <article key={section.title} className="rounded-lg border bg-card p-5">
            <h4 className="mb-2 font-semibold">{section.title}</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <article className="rounded-lg border bg-card p-5">
        <h4 className="mb-2 font-semibold">Booking Suggestion</h4>
        <p className="text-sm text-muted-foreground">{result.bookingSuggestion}</p>
      </article>

      <div className="rounded-lg border bg-primary/5 p-5">
        <p className="font-medium">Want help booking this trip with a local expert?</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button>Request Booking Help</Button>
          <Button variant="outline" onClick={onReset}>Create Another Trip</Button>
        </div>
      </div>
    </section>
  );
}
