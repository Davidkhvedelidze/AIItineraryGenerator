import { findRegionGroup } from "@/lib/itinerary/matchRegion";

/**
 * Central place for every affiliate link on the site. Swap the placeholder
 * URLs/partner IDs here once Travelpayouts (or another partner) registration
 * is complete — nothing else needs to change.
 */
const TRAVELPAYOUTS_PARTNER_ID = "PLACEHOLDER_PARTNER_ID";

function buildAccommodationDeepLink(citySlug: string): string {
  return `https://tp.media/r?marker=${TRAVELPAYOUTS_PARTNER_ID}&campaign_id=101&trs=1&p=4114&u=https%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Fss%3D${encodeURIComponent(
    citySlug,
  )}`;
}

const ACCOMMODATION_DEEP_LINKS: Record<string, string> = {
  tbilisi: buildAccommodationDeepLink("Tbilisi, Georgia"),
  kazbegi: buildAccommodationDeepLink("Stepantsminda, Georgia"),
  mestia: buildAccommodationDeepLink("Mestia, Georgia"),
  sighnaghi: buildAccommodationDeepLink("Sighnaghi, Georgia"),
  batumi: buildAccommodationDeepLink("Batumi, Georgia"),
  kutaisi: buildAccommodationDeepLink("Kutaisi, Georgia"),
};

export type AccommodationAffiliateLink = {
  location: string;
  url: string;
};

/** Returns the accommodation affiliate block for a day's region, or null if it isn't a known overnight-stay city. */
export function getAccommodationAffiliateLink(dayRegion: string): AccommodationAffiliateLink | null {
  const group = findRegionGroup(dayRegion);
  if (!group?.accommodationLabel) return null;

  const url = ACCOMMODATION_DEEP_LINKS[group.key];
  if (!url) return null;

  return { location: group.accommodationLabel, url };
}

export const INSURANCE_AFFILIATE_LINK = {
  label: "Compare travel insurance for Georgia",
  description: "Protect your trip against cancellations, medical costs, and lost luggage.",
  url: `https://tp.media/r?marker=${TRAVELPAYOUTS_PARTNER_ID}&campaign_id=102&trs=1&p=4115&u=https%3A%2F%2Fwww.ekta.ge%2F`,
};
