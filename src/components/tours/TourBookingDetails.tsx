import type { ReactNode } from "react";
import {
  CalendarDays,
  Languages,
  MapPin,
  PlaneLanding,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Tour } from "@/types/sanity-tour";

type TourBookingDetailsProps = {
  tour: Tour;
};

function visibleItems(items?: string[]) {
  return items?.filter(Boolean) ?? [];
}

function DetailCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
          <Icon className="h-5 w-5 text-amber-700" aria-hidden="true" />
        </span>
        <h3 className="font-semibold tracking-tight">{title}</h3>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">{children}</div>
    </article>
  );
}

function ChipList({ items }: { items?: string[] }) {
  const chips = visibleItems(items);
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((item) => (
        <span
          key={item}
          className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;

  return (
    <p>
      <span className="font-semibold text-foreground">{label}: </span>
      {value}
    </p>
  );
}

export function TourBookingDetails({ tour }: TourBookingDetailsProps) {
  const pickupLocations = visibleItems(tour.pickupLocations);
  const departureTimes = visibleItems(tour.departureTimes);
  const operatingDays = visibleItems(tour.operatingDays);
  const requiredInfo = visibleItems(tour.requiredTravelerInfo);
  const accessNotes = [...visibleItems(tour.accessibilityNotes), ...visibleItems(tour.healthNotes)];
  const ageGroups =
    tour.ageGroups?.filter((group) => group.label || group.range || group.note) ?? [];

  const hasPickup =
    tour.pickupInfo || pickupLocations.length > 0 || tour.airport || tour.bookingNotificationNote;
  const hasSchedule =
    departureTimes.length > 0 ||
    operatingDays.length > 0 ||
    tour.bookingCutoff ||
    tour.confirmationMethod;
  const hasTravelers = tour.maxTravelers || requiredInfo.length > 0 || ageGroups.length > 0;
  const hasGuide =
    tour.guideLanguage ||
    tour.guideNote ||
    tour.audioGuide ||
    tour.writtenGuide ||
    tour.difficultyLevel ||
    accessNotes.length > 0;
  const hasPolicy = tour.cancellationPolicy || tour.operatorCancellationRights;
  const hasOperator = tour.listingName || tour.listingLocation || tour.contactPhone;

  if (!hasPickup && !hasSchedule && !hasTravelers && !hasGuide && !hasPolicy && !hasOperator) {
    return null;
  }

  return (
    <section id="details" className="scroll-mt-24 space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Booking details
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Pickup, confirmation, and traveler info
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {hasPickup ? (
          <DetailCard title="Pickup and transfer" icon={PlaneLanding}>
            <DetailRow label="Airport" value={tour.airport} />
            {tour.pickupInfo ? <p>{tour.pickupInfo}</p> : null}
            <ChipList items={pickupLocations} />
            {tour.bookingNotificationNote ? <p>{tour.bookingNotificationNote}</p> : null}
          </DetailCard>
        ) : null}

        {hasSchedule ? (
          <DetailCard title="Schedule and confirmation" icon={CalendarDays}>
            <DetailRow label="Booking cutoff" value={tour.bookingCutoff} />
            <DetailRow label="Confirmation" value={tour.confirmationMethod} />
            {departureTimes.length > 0 ? (
              <div>
                <p className="mb-2 font-semibold text-foreground">Departure times</p>
                <ChipList items={departureTimes} />
              </div>
            ) : null}
            {operatingDays.length > 0 ? (
              <div>
                <p className="mb-2 font-semibold text-foreground">Operating days</p>
                <ChipList items={operatingDays} />
              </div>
            ) : null}
          </DetailCard>
        ) : null}

        {hasTravelers ? (
          <DetailCard title="Travelers" icon={Users}>
            <DetailRow
              label="Max travelers"
              value={tour.maxTravelers ? `${tour.maxTravelers} travelers` : null}
            />
            {requiredInfo.length > 0 ? (
              <div>
                <p className="mb-2 font-semibold text-foreground">Required traveler info</p>
                <ChipList items={requiredInfo} />
              </div>
            ) : null}
            {ageGroups.length > 0 ? (
              <div className="grid gap-2">
                {ageGroups.map((group, index) => (
                  <div
                    key={`${group.label || "age"}-${index}`}
                    className="rounded-xl bg-muted px-3 py-2"
                  >
                    <p className="font-semibold text-foreground">
                      {[group.label, group.range].filter(Boolean).join(" · ")}
                    </p>
                    {group.note ? <p className="mt-1 text-xs leading-5">{group.note}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </DetailCard>
        ) : null}

        {hasGuide ? (
          <DetailCard title="Guide, access, and difficulty" icon={Languages}>
            <DetailRow label="Guide language" value={tour.guideLanguage} />
            <DetailRow label="Audio guide" value={tour.audioGuide} />
            <DetailRow label="Written guide" value={tour.writtenGuide} />
            <DetailRow label="Difficulty" value={tour.difficultyLevel} />
            {tour.guideNote ? <p>{tour.guideNote}</p> : null}
            <ChipList items={accessNotes} />
          </DetailCard>
        ) : null}

        {hasPolicy ? (
          <DetailCard title="Cancellation and operator rights" icon={ShieldCheck}>
            {tour.cancellationPolicy ? <p>{tour.cancellationPolicy}</p> : null}
            {tour.operatorCancellationRights ? <p>{tour.operatorCancellationRights}</p> : null}
          </DetailCard>
        ) : null}

        {hasOperator ? (
          <DetailCard title="Operator" icon={MapPin}>
            <DetailRow label="Listing" value={tour.listingName} />
            <DetailRow label="Location" value={tour.listingLocation} />
            <DetailRow label="Contact" value={tour.contactPhone} />
          </DetailCard>
        ) : null}
      </div>
    </section>
  );
}
