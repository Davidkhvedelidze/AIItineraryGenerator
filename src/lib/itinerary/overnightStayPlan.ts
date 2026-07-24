import { findRegionGroup } from "@/lib/itinerary/matchRegion";

export type OvernightStayDay = { day: number; region?: string };

/** Maps a stay's first day number to how many nights it covers. */
export type OvernightStayPlan = Map<number, number>;

/**
 * Consecutive days spent in the same accommodation city are one Booking.com
 * stay, not one per night — a 3-night Tbilisi block should show a single
 * "Where to stay" offer on day 1, checked out 3 nights later, not the same
 * offer repeated on days 1, 2, and 3.
 */
export function buildOvernightStayPlan(days: OvernightStayDay[]): OvernightStayPlan {
  const plan: OvernightStayPlan = new Map();

  let index = 0;
  while (index < days.length) {
    const group = findRegionGroup(days[index].region ?? "");

    if (!group?.accommodationLabel) {
      index += 1;
      continue;
    }

    let runEnd = index + 1;
    while (
      runEnd < days.length &&
      findRegionGroup(days[runEnd].region ?? "")?.key === group.key
    ) {
      runEnd += 1;
    }

    plan.set(days[index].day, runEnd - index);
    index = runEnd;
  }

  return plan;
}

export type AiOvernightStay = { day: number; city: string };

/**
 * Same output shape as buildOvernightStayPlan, but sourced from the AI's own
 * overnightStayPlan field instead of matching day.region against the static
 * accommodation-city table. The AI lists only the first day of each stay, so
 * a stay's nights run until the next listed day (or the end of the trip for
 * the last stay).
 */
export function buildOvernightStayPlanFromAi(
  aiPlan: AiOvernightStay[],
  totalDays: number,
): OvernightStayPlan {
  const plan: OvernightStayPlan = new Map();
  const sorted = [...aiPlan].sort((a, b) => a.day - b.day);

  sorted.forEach((stay, index) => {
    const nextStayDay = sorted[index + 1]?.day ?? totalDays + 1;
    const nights = nextStayDay - stay.day;
    if (nights > 0) plan.set(stay.day, nights);
  });

  return plan;
}
