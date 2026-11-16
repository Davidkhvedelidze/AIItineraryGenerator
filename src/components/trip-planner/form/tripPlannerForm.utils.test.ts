import { describe, expect, it } from "vitest";
import { calculateTripLength } from "./tripPlannerForm.utils";

describe("calculateTripLength", () => {
  it("returns null values when travel dates are missing", () => {
    expect(calculateTripLength(undefined)).toEqual({ days: null, nights: null });
  });

  it("returns null values when departure is before arrival", () => {
    const result = calculateTripLength(["2026-08-06T18:00:00.000Z", "2026-08-01T10:00:00.000Z"]);

    expect(result).toEqual({ days: null, nights: null });
  });

  it("calculates a multi-day trip correctly", () => {
    const result = calculateTripLength(["2026-08-01T10:00:00.000Z", "2026-08-06T18:00:00.000Z"]);

    expect(result).toEqual({ days: 6, nights: 5 });
  });

  it("calculates a same-day trip as 1 day / 0 nights", () => {
    // Day boundaries are the traveler's local calendar days (the picker emits local times),
    // so build the ISO strings from local times to keep this test timezone-independent.
    const result = calculateTripLength([
      new Date(2026, 7, 1, 8, 0).toISOString(),
      new Date(2026, 7, 1, 20, 0).toISOString(),
    ]);

    expect(result).toEqual({ days: 1, nights: 0 });
  });

  it("counts nights by local calendar day, not elapsed hours", () => {
    const result = calculateTripLength([
      new Date(2026, 7, 1, 23, 30).toISOString(),
      new Date(2026, 7, 2, 6, 0).toISOString(),
    ]);

    expect(result).toEqual({ days: 2, nights: 1 });
  });
});
