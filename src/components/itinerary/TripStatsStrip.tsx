import { CalendarDays, Compass, Users, Wallet } from "lucide-react";

function formatLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-amber-800">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-base font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

type TripStatsStripProps = {
  tripLength: number;
  travelers?: number;
  travelStyle: string;
  cost?: string;
  costLabel?: string;
};

export function TripStatsStrip({
  tripLength,
  travelers,
  travelStyle,
  cost,
  costLabel = "Estimated budget",
}: TripStatsStripProps) {
  return (
    <div className="border-b border-stone-200 bg-white">
      <div className="container flex flex-wrap items-center justify-center gap-x-10 gap-y-5 py-7 sm:justify-between">
        <StatItem icon={CalendarDays} label="Trip length" value={`${tripLength} days`} />
        {travelers ? (
          <StatItem
            icon={Users}
            label="Travelers"
            value={`${travelers} ${travelers === 1 ? "person" : "people"}`}
          />
        ) : null}
        <StatItem icon={Compass} label="Pace" value={formatLabel(travelStyle)} />
        {cost ? <StatItem icon={Wallet} label={costLabel} value={cost} /> : null}
      </div>
    </div>
  );
}
