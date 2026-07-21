import { findRegionGroup, regionTextMatchesGroup } from "@/lib/itinerary/matchRegion";
import type { TourListItem } from "@/types/sanity-tour";

/** Matches a day's free-text region against our own tours' regions[], for our-tours-take-priority display. */
export function matchToursForDayRegion(dayRegion: string, tours: TourListItem[]): TourListItem[] {
  const group = findRegionGroup(dayRegion);
  if (!group?.tourRegionLabel) return [];

  return tours.filter((tour) =>
    (tour.regions ?? []).some((tourRegion) => regionTextMatchesGroup(tourRegion, group)),
  );
}
