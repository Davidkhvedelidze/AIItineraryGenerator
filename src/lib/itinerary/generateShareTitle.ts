import { getPrimaryRegionLabel } from "@/lib/itinerary/regionImages";
import type { ItineraryDay, TripInterest } from "@/types/trip";

const INTEREST_LABELS: Record<TripInterest, string> = {
  mountains: "Mountain",
  wine: "Wine",
  food: "Food & Wine",
  history: "History",
  culture: "Culture",
  hiking: "Hiking",
  sea: "Seaside",
  nightlife: "Nightlife",
  "family-friendly": "Family",
  photography: "Photography",
};

/**
 * Prefill for the "Share to public gallery" title field — built entirely from
 * trip metadata (duration, interest, most-visited region), never from personal
 * data like the traveler's name or email.
 */
export function generateShareTitle(
  tripLength: number,
  interests: TripInterest[],
  days: Pick<ItineraryDay, "region">[],
): string {
  const theme = interests.map((interest) => INTEREST_LABELS[interest]).find(Boolean) ?? "Culture";
  const region = getPrimaryRegionLabel(days);

  return `${tripLength}-Day ${theme} Trip: ${region}`;
}
