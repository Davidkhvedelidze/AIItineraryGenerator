"use client";

import { useState } from "react";
import { Drawer } from "antd";
import {
  CalendarCheck,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { getTourPriceSummary } from "@/lib/tour-pricing";
import type { Tour } from "@/types/sanity-tour";
import { TourBookingForm } from "@/components/tours/TourBookingForm";
import { normalizeExternalUrl } from "@/lib/utils";

export type TourBookingBoxTour = Pick<
  Tour,
  | "slug"
  | "title"
  | "priceFrom"
  | "currency"
  | "pricingTiers"
  | "priceNote"
  | "tripadvisorUrl"
  | "directBookingEnabled"
  | "maxTravelers"
  | "confirmationMethod"
  | "airport"
  | "pickupInfo"
  | "cancellationPolicy"
  | "directBookingCtaTitle"
  | "directBookingCtaText"
>;

type TourBookingBoxProps = {
  tour: TourBookingBoxTour;
  compact?: boolean;
};

export function TourBookingBox({ tour, compact = false }: TourBookingBoxProps) {
  const [open, setOpen] = useState(false);
  const price = getTourPriceSummary(tour);
  const tripadvisorUrl = normalizeExternalUrl(tour.tripadvisorUrl);
  // const pickupLine = tour.airport
  //   ? `${tour.airport} transfer or custom pickup can be arranged.`
  //   : tour.pickupInfo || "Pickup details are confirmed before the tour.";

  const content = (
    <div className="space-y-4">
      {price ? (
        <div className="rounded-2xl bg-secondary p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {price.label}
          </p>
          <p className="text-2xl font-semibold">{price.value}</p>
          {price.helperText ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {price.helperText}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-2 text-sm text-muted-foreground">
        {/* {tour.maxTravelers ? (
          <p className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
            <Users className="h-4 w-4 text-amber-700" aria-hidden="true" />
            Up to {tour.maxTravelers} travelers
          </p>
        ) : null} */}
        {/* {pickupLine ? (
          <p className="inline-flex items-start gap-2 rounded-xl bg-muted px-3 py-2">
            <PlaneLanding
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
              aria-hidden="true"
            />
            <span>{pickupLine}</span>
          </p>
        ) : null} */}
        {tour.confirmationMethod ? (
          <p className="inline-flex items-start gap-2 rounded-xl bg-muted px-3 py-2">
            <ShieldCheck
              className="h-4 w-4 text-amber-700"
              aria-hidden="true"
            />
            <span>{tour.confirmationMethod}</span>
          </p>
        ) : null}
        {/* {tour.cancellationPolicy ? (
          <p className="inline-flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-stone-900">
            <BadgeCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
              aria-hidden="true"
            />
            <span>{tour.cancellationPolicy}</span>
          </p>
        ) : null} */}
      </div>

      {tour.directBookingEnabled !== false ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Request Direct Booking
        </button>
      ) : null}

      {tripadvisorUrl ? (
        <a
          href={tripadvisorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-primary-soft"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Book on TripAdvisor/Viator
        </a>
      ) : null}

      <a
        href={`https://wa.me/995551181358?text=${encodeURIComponent(
          `Hello, I would like help with ${tour.title}.`,
        )}`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition hover:bg-muted"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Ask on WhatsApp
      </a>
    </div>
  );

  return (
    <>
      <aside
        className={
          compact
            ? "rounded-2xl border bg-card p-5 shadow-sm"
            : "sticky top-24 rounded-2xl border bg-card p-5 shadow-sm"
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Secure your date
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">
          {tour.directBookingCtaTitle || "Book this tour"}
        </h2>
        <p className="mb-5 mt-2 text-sm leading-6 text-muted-foreground">
          {tour.directBookingCtaText ||
            "Choose TripAdvisor checkout or send a direct request for availability, pickup details, and custom route support."}
        </p>
        {content}
      </aside>

      <Drawer
        title="Request direct booking"
        open={open}
        onClose={() => setOpen(false)}
        width="min(100vw, 520px)"
        styles={{ body: { paddingBottom: 24 } }}
      >
        <TourBookingForm
          tourSlug={tour.slug}
          tourTitle={tour.title}
          onSuccess={() => window.setTimeout(() => setOpen(false), 900)}
        />
      </Drawer>
    </>
  );
}
