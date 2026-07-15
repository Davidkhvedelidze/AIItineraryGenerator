import { describe, expect, it } from "vitest";
import { tripFormSchema } from "./tripFormSchema";

const baseData = {
  days: 5,
  arrivalAirport: "Tbilisi International Airport",
  departureAirport: "Tbilisi International Airport",
  preferredCities: ["Tbilisi"],
  interests: ["culture"],
  budget: "medium",
  travelStyle: "balanced",
  tourType: "private-guided",
  travelers: 2,
  language: "English",
  email: "traveler@example.com",
  mobileNumber: "",
  tourDescription: "",
};

function withTravelDates(arrival: string, departure: string) {
  return { ...baseData, travelDates: [arrival, departure] as [string, string] };
}

describe("tripFormSchema travel dates", () => {
  it("accepts a valid arrival-before-departure range", () => {
    const result = tripFormSchema.safeParse(
      withTravelDates("2026-08-01T10:00:00.000Z", "2026-08-06T18:00:00.000Z"),
    );

    expect(result.success).toBe(true);
  });

  it("rejects a reversed range where departure is before arrival", () => {
    const result = tripFormSchema.safeParse(
      withTravelDates("2026-08-06T18:00:00.000Z", "2026-08-01T10:00:00.000Z"),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === "Departure must be after arrival.")).toBe(true);
    }
  });

  it("rejects equal arrival and departure dates", () => {
    const sameInstant = "2026-08-01T10:00:00.000Z";
    const result = tripFormSchema.safeParse(withTravelDates(sameInstant, sameInstant));

    expect(result.success).toBe(false);
  });

  it("rejects invalid datetime strings", () => {
    const result = tripFormSchema.safeParse(withTravelDates("not-a-date", "2026-08-06T18:00:00.000Z"));

    expect(result.success).toBe(false);
  });
});

describe("tripFormSchema request validation", () => {
  it("rejects a malformed request body missing required fields", () => {
    const result = tripFormSchema.safeParse({ email: "traveler@example.com" });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = tripFormSchema.safeParse({
      ...withTravelDates("2026-08-01T10:00:00.000Z", "2026-08-06T18:00:00.000Z"),
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });
});
