import { CalendarDays, Car, Clock3, MapPin, PlaneLanding } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "@/components/blog/blog.module.css";
import type { DestinationQuickFacts as QuickFacts } from "@/types/sanity-destination";

type Fact = {
  label: string;
  value?: string | null;
  icon: LucideIcon;
};

export function hasQuickFacts(facts?: QuickFacts | null) {
  if (!facts) return false;
  return Object.values(facts).some((value) => value !== null && value !== undefined && value !== "");
}

export function DestinationQuickFacts({ facts }: { facts?: QuickFacts | null }) {
  if (!facts || !hasQuickFacts(facts)) return null;

  const items: Fact[] = [
    {
      label: "From Tbilisi",
      value: typeof facts.distanceFromTbilisiKm === "number" ? `${facts.distanceFromTbilisiKm} km` : null,
      icon: MapPin,
    },
    { label: "Drive time", value: facts.driveTimeFromTbilisi, icon: Car },
    { label: "Best time to visit", value: facts.bestTimeToVisit, icon: CalendarDays },
    { label: "Days needed", value: facts.daysNeeded, icon: Clock3 },
    { label: "Nearest airport", value: facts.nearestAirport, icon: PlaneLanding },
  ].filter((item) => Boolean(item.value?.trim()));

  return (
    <section aria-labelledby="quick-facts-heading" className={`rounded-2xl border p-5 sm:p-6 ${styles.border} ${styles.soft}`}>
      <h2 id="quick-facts-heading" className="sr-only">
        Quick facts
      </h2>
      {items.length > 0 ? (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          {items.map(({ label, value, icon: Icon }) => (
            <div key={label} className="min-w-0">
              <dt className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.08em] ${styles.muted}`}>
                <Icon className={`h-4 w-4 shrink-0 ${styles.accent}`} aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1.5 break-words text-base font-semibold leading-snug">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {facts.gettingThere?.trim() ? (
        <div className={items.length > 0 ? `mt-5 border-t pt-5 ${styles.border}` : undefined}>
          <h3 className={`text-xs font-semibold uppercase tracking-[.08em] ${styles.muted}`}>Getting there</h3>
          <p className={`mt-1.5 text-sm leading-7 ${styles.muted}`}>{facts.gettingThere}</p>
        </div>
      ) : null}
    </section>
  );
}
