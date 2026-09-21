"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = Omit<ComponentProps<typeof Link>, "href" | "onClick" | "onAuxClick"> & {
  tourSlug: string;
  clickLocation: "tour_card" | "itinerary_recommendation";
};

export function TourLink({ tourSlug, clickLocation, ...props }: Props) {
  const trackClick = () => trackEvent("tour_click", {
    tour_slug: tourSlug,
    click_location: clickLocation,
  });
  return (
    <Link
      {...props}
      href={`/tours/${tourSlug}`}
      onClick={trackClick}
      onAuxClick={(event) => { if (event.button === 1) trackClick(); }}
    />
  );
}
