import { BadgeCheck } from "lucide-react";
import { DaySection } from "@/components/itinerary/DaySection";
import type { OvernightStayPlan } from "@/lib/itinerary/overnightStayPlan";
import type { ItineraryResult } from "@/types/trip";
import type { TourListItem } from "@/types/sanity-tour";

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanList(items?: string[]): string[] {
  return items?.map(cleanText).filter(Boolean) ?? [];
}

function SummaryList({ title, items }: { title: string; items?: string[] }) {
  const visibleItems = cleanList(items);
  if (visibleItems.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground">
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {visibleItems.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground">
            <BadgeCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type ItineraryContentProps = {
  result: ItineraryResult;
  tours: TourListItem[];
  overnightStayPlan: OvernightStayPlan;
  /** Omit on public gallery pages so booking links don't carry a real submitter's travel dates. */
  tripStartDateTime?: string;
  adults?: number;
};

export function ItineraryContent({
  result,
  tours,
  overnightStayPlan,
  tripStartDateTime,
  adults,
}: ItineraryContentProps) {
  const days = result.days ?? [];

  return (
    <div className="container">
      <div className="mx-auto">
        {cleanText(result.overview) ? (
          <p className="mx-auto max-w-[68ch] pb-12 text-center font-serif text-xl italic leading-8 text-foreground/85 sm:text-2xl">
            &ldquo;{result.overview}&rdquo;
          </p>
        ) : null}

        {days.length > 0 ? (
          <div className="space-y-8 pb-16 md:space-y-14">
            {days.map((day, index) => (
              <DaySection
                key={`${day.day}-${day.title}`}
                day={day}
                index={index}
                isLast={index === days.length - 1}
                tours={tours}
                tripStartDateTime={tripStartDateTime}
                adults={adults}
                showAccommodation={overnightStayPlan.has(day.day)}
                accommodationNights={overnightStayPlan.get(day.day)}
                accommodationCity={cleanText(day.overnightStay)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white p-5 text-center text-sm leading-6 text-muted-foreground">
            This itinerary doesn&apos;t have a day-by-day plan yet.
          </div>
        )}

        <section className="border-t border-stone-200 pb-16 pt-12">
          <h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-foreground">
            Trip notes
          </h2>

          <div className="mx-auto mt-10 grid max-w-2xl gap-8 sm:grid-cols-2 md:max-w-full lg:grid-cols-4">
            <SummaryList title="Best for" items={result.bestFor} />
            <SummaryList title="Included" items={result.includedServices} />
            <SummaryList title="Not included" items={result.notIncludedServices} />
            <SummaryList title="Packing tips" items={result.packingTips} />
            <SummaryList title="Transport tips" items={result.transportTips} />
            <SummaryList title="Local food to try" items={result.localFoodToTry} />
          </div>
        </section>
      </div>
    </div>
  );
}

export function BookingSuggestion({ text }: { text?: string }) {
  if (!cleanText(text)) return null;

  return (
    <p className="mx-auto mb-10 max-w-[60ch] text-center font-serif text-lg italic leading-8 text-foreground/80">
      {text}
    </p>
  );
}
