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
    const result = calculateTripLength(["2026-08-01T08:00:00.000Z", "2026-08-01T20:00:00.000Z"]);

    expect(result).toEqual({ days: 1, nights: 0 });
  });
});
