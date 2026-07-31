import { findRegionGroup } from "@/lib/itinerary/matchRegion";

/**
 * Central place for every affiliate link on the site. Swap the placeholder
 * URLs/partner IDs here once Travelpayouts (or another partner) registration
 * is complete — nothing else needs to change.
 */

/** Booking.com affiliate partner ID (Travelpayouts). Not a secret — it's visible in every generated URL. */
const BOOKING_AID = process.env.NEXT_PUBLIC_BOOKING_AID?.trim() || "818288";

const BOOKING_SS_BY_REGION: Record<string, string> = {
  tbilisi: "Tbilisi, Georgia",
  mtskheta: "Mtskheta, Georgia",
  kazbegi: "Stepantsminda, Georgia",
  kakheti: "Sighnaghi, Georgia",
  sighnaghi: "Sighnaghi, Georgia",
  svaneti: "Mestia, Georgia",
  mestia: "Mestia, Georgia",
  batumi: "Batumi, Georgia",
  kutaisi: "Kutaisi, Georgia",
  "gori-uplistsikhe": "Gori, Georgia",
};

const BOOKING_SS_FALLBACK = "Tbilisi, Georgia";

export type BookingLinkParams = {
  region: string;
  checkin?: string;
  checkout?: string;
  adults?: number;
};

/** Builds a Booking.com search-results deep link with our affiliate `aid` preserved. */
export function buildBookingLink({
  region,
  checkin,
  checkout,
  adults = 2,
}: BookingLinkParams): string {
  const ss = BOOKING_SS_BY_REGION[region] ?? BOOKING_SS_FALLBACK;

  const params = new URLSearchParams({
    ss,
    group_adults: String(adults),
    no_rooms: "1",
    aid: BOOKING_AID,
  });

  if (checkin && checkout) {
    params.set("checkin", checkin);
    params.set("checkout", checkout);
  }

  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

function toUtcDateParts(isoDateTime: string): { year: number; month: number; day: number } | null {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return null;
  return { year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() };
}

function formatUtcDate(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}

/**
 * Day N's stay is [tripStart + (N-1) days, tripStart + (N-1+nights) days) —
 * a booking window anchored to the trip's actual start date. `nights`
 * defaults to 1, but should be the full length of a multi-night stay in the
 * same city so the checkout date covers the whole stay, not just one night.
 */
export function computeStayDates(
  tripStartDateTime: string,
  dayNumber: number,
  nights = 1,
): { checkin: string; checkout: string } | null {
  if (!Number.isInteger(dayNumber) || dayNumber < 1) return null;
  if (!Number.isInteger(nights) || nights < 1) return null;

  const start = toUtcDateParts(tripStartDateTime);
  if (!start) return null;

  const offset = dayNumber - 1;
  return {
    checkin: formatUtcDate(start.year, start.month, start.day + offset),
    checkout: formatUtcDate(start.year, start.month, start.day + offset + nights),
  };
}

export type AccommodationAffiliateLink = {
  location: string;
  url: string;
};

export type AccommodationAffiliateLinkOptions = {
  /** The itinerary day number (1-indexed). Combined with tripStartDateTime for Tier A checkin/checkout. */
  dayNumber?: number;
  /** ISO arrival date/time for the whole trip (form_data.travelDates[0]). Omit to skip dates (Tier B/C). */
  tripStartDateTime?: string;
  adults?: number;
  /** Full length of this stay in nights (e.g. 3 for a 3-night stay in the same city). Defaults to 1. */
  nights?: number;
};

/** Returns the accommodation affiliate block for a day's region, or null if it isn't a known overnight-stay city. */
export function getAccommodationAffiliateLink(
  dayRegion: string,
  options: AccommodationAffiliateLinkOptions = {},
): AccommodationAffiliateLink | null {
  const group = findRegionGroup(dayRegion);
  if (!group?.accommodationLabel) return null;

  const stayDates =
    options.dayNumber !== undefined && options.tripStartDateTime
      ? computeStayDates(options.tripStartDateTime, options.dayNumber, options.nights)
      : null;

  const url = buildBookingLink({
    region: group.key,
    checkin: stayDates?.checkin,
    checkout: stayDates?.checkout,
    adults: options.adults,
  });

  return { location: group.accommodationLabel, url };
}

export const INSURANCE_AFFILIATE_LINK = {
  label: "Compare travel insurance for Georgia",
  description: "Protect your trip against cancellations, medical costs, and lost luggage.",
  url: "https://visitorscoverage.tpk.lu/ki7iMPPK",
};

export const ESIM_AFFILIATE_LINK = {
  label: "Get an eSIM for Georgia",
  description: "Stay connected from landing with a data plan you can activate before you fly.",
  url: "https://yesim.tpk.lu/t19OXCsG",
};

export const CAR_RENTAL_AFFILIATE_LINK = {
  label: "Compare car rental deals",
  description: "Explore at your own pace with a rental car booked for your travel dates.",
  url: "https://discovercars.tpk.lu/B8sVLTOB",
};
