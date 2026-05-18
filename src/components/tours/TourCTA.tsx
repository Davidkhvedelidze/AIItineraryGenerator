import Link from "next/link";
import { CalendarCheck, ExternalLink, Wand2 } from "lucide-react";
import { normalizeExternalUrl } from "@/lib/utils";

type TourCTAProps = {
  tripadvisorUrl?: string;
  directBookingEnabled?: boolean;
};

export function TourCTA({ tripadvisorUrl, directBookingEnabled = true }: TourCTAProps) {
  const safeTripadvisorUrl = normalizeExternalUrl(tripadvisorUrl);

  return (
    <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div className="grid gap-6 bg-[linear-gradient(135deg,hsl(0_0%_100%),hsl(48_100%_92%))] p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Private customization
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Want this tour customized for your group?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Request direct booking and adjust pickup, route details, timing,
            family needs, and travel pace before confirming your trip.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {directBookingEnabled ? (
            <a
              href="#booking"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Request Direct Booking
            </a>
          ) : null}
          <Link
            href="/#trip-planner"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border bg-background px-4 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            Generate Custom Itinerary
          </Link>
          {safeTripadvisorUrl ? (
            <a
              href={safeTripadvisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border bg-background px-4 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Book on TripAdvisor
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
