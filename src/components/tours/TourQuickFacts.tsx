import {
  CarFront,
  Clock,
  Gauge,
  Languages,
  MapPin,
  PlaneLanding,
  Route,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Tour } from "@/types/sanity-tour";

type TourQuickFactsProps = {
  tour: Tour;
};

type QuickFact = {
  label: string;
  value?: string | number | null;
  icon: LucideIcon;
  tone?: string;
};

export function TourQuickFacts({ tour }: TourQuickFactsProps) {
  const pickupValue = tour.airport
    ? `${tour.airport} transfer available`
    : tour.pickupLocations?.length || tour.pickupInfo
      ? "Pickup available"
      : null;
  const facts: QuickFact[] = [
    { label: "Duration", value: tour.duration, icon: Clock },
    { label: "Starts", value: tour.startingLocation, icon: MapPin, tone: "bg-sky-50" },
    { label: "Ends", value: tour.endingLocation, icon: Route, tone: "bg-amber-50" },
    { label: "Tour type", value: tour.tourType, icon: CarFront },
    { label: "Group type", value: tour.groupType, icon: ShieldCheck },
    {
      label: "Max travelers",
      value: tour.maxTravelers ? `${tour.maxTravelers} travelers` : null,
      icon: Users,
    },
    { label: "Guide language", value: tour.guideLanguage, icon: Languages },
    { label: "Difficulty", value: tour.difficultyLevel, icon: Gauge },
    { label: "Pickup", value: pickupValue, icon: PlaneLanding, tone: "bg-amber-50" },
  ].filter((fact) => fact.value);

  if (facts.length === 0) return null;

  return (
    <section
      aria-label="Tour quick facts"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {facts.map((fact) => {
        const Icon = fact.icon;
        return (
          <div
            key={fact.label}
            className="rounded-2xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`inline-flex rounded-xl p-2 ${fact.tone || "bg-secondary"}`}>
              <Icon className="h-5 w-5 text-amber-700" aria-hidden="true" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {fact.label}
            </p>
            <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
              {fact.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}
