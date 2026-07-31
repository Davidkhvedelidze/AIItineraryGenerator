import { describe, expect, it } from "vitest";
import {
  buildBookingLink,
  computeStayDates,
  getAccommodationAffiliateLink,
} from "./affiliate-config";

describe("computeStayDates", () => {
  const tripStart = "2026-08-01T10:00:00.000Z";

  it("Day 1: checkin equals the trip start date, checkout is the next day", () => {
    expect(computeStayDates(tripStart, 1)).toEqual({
      checkin: "2026-08-01",
      checkout: "2026-08-02",
    });
  });

  it("a middle day (Day 3): checkin is start + 2 days", () => {
    expect(computeStayDates(tripStart, 3)).toEqual({
      checkin: "2026-08-03",
      checkout: "2026-08-04",
    });
  });

  it("the last day of a 6-day trip (Day 6): checkin is start + 5 days", () => {
    expect(computeStayDates(tripStart, 6)).toEqual({
      checkin: "2026-08-06",
      checkout: "2026-08-07",
    });
  });

  it("rolls over a month boundary correctly", () => {
    expect(computeStayDates("2026-08-30T10:00:00.000Z", 3)).toEqual({
      checkin: "2026-09-01",
      checkout: "2026-09-02",
    });
  });

  it("returns null for an invalid date or non-positive day number", () => {
    expect(computeStayDates("not-a-date", 1)).toBeNull();
    expect(computeStayDates(tripStart, 0)).toBeNull();
    expect(computeStayDates(tripStart, -1)).toBeNull();
  });

  it("a multi-night stay (nights=3): checkout is 3 days after checkin, not 1", () => {
    expect(computeStayDates(tripStart, 1, 3)).toEqual({
      checkin: "2026-08-01",
      checkout: "2026-08-04",
    });
  });

  it("a multi-night stay starting mid-trip (Day 4, nights=2)", () => {
    expect(computeStayDates(tripStart, 4, 2)).toEqual({
      checkin: "2026-08-04",
      checkout: "2026-08-06",
    });
  });

  it("returns null for a non-positive nights value", () => {
    expect(computeStayDates(tripStart, 1, 0)).toBeNull();
    expect(computeStayDates(tripStart, 1, -1)).toBeNull();
  });
});

describe("buildBookingLink", () => {
  it("includes checkin/checkout, ss ending in ', Georgia', and aid when dates are known", () => {
    const url = buildBookingLink({
      region: "kazbegi",
      checkin: "2026-08-03",
      checkout: "2026-08-04",
    });
    const parsed = new URL(url);

    expect(parsed.origin + parsed.pathname).toBe(
      "https://www.booking.com/searchresults.html",
    );
    expect(parsed.searchParams.get("ss")).toBe("Stepantsminda, Georgia");
    expect(parsed.searchParams.get("ss")).toMatch(/, Georgia$/);
    expect(parsed.searchParams.get("checkin")).toBe("2026-08-03");
    expect(parsed.searchParams.get("checkout")).toBe("2026-08-04");
    expect(parsed.searchParams.get("group_adults")).toBe("2");
    expect(parsed.searchParams.get("no_rooms")).toBe("1");
    expect(parsed.searchParams.get("aid")).toBeTruthy();
  });

  it("omits checkin/checkout entirely when dates are unknown, but keeps ss + aid", () => {
    const url = buildBookingLink({ region: "batumi" });
    const parsed = new URL(url);

    expect(parsed.searchParams.get("ss")).toBe("Batumi, Georgia");
    expect(parsed.searchParams.has("checkin")).toBe(false);
    expect(parsed.searchParams.has("checkout")).toBe(false);
    expect(parsed.searchParams.get("aid")).toBeTruthy();
  });

  it("falls back to Tbilisi, Georgia for an unmapped region", () => {
    const url = buildBookingLink({ region: "unknown-region" });
    expect(new URL(url).searchParams.get("ss")).toBe("Tbilisi, Georgia");
  });

  it("respects a custom adults count", () => {
    const url = buildBookingLink({ region: "tbilisi", adults: 4 });
    expect(new URL(url).searchParams.get("group_adults")).toBe("4");
  });
});

describe("getAccommodationAffiliateLink", () => {
  it("Tier A: includes checkin/checkout when dayNumber + tripStartDateTime are given", () => {
    const link = getAccommodationAffiliateLink("Kazbegi", {
      dayNumber: 2,
      tripStartDateTime: "2026-08-01T10:00:00.000Z",
    });
    expect(link).not.toBeNull();
    const parsed = new URL(link!.url);
    expect(parsed.searchParams.get("checkin")).toBe("2026-08-02");
    expect(parsed.searchParams.get("checkout")).toBe("2026-08-03");
  });

  it("Tier B/C: omits checkin/checkout when tripStartDateTime is missing", () => {
    const link = getAccommodationAffiliateLink("Batumi");
    expect(link).not.toBeNull();
    const parsed = new URL(link!.url);
    expect(parsed.searchParams.has("checkin")).toBe(false);
    expect(parsed.searchParams.has("checkout")).toBe(false);
    expect(parsed.searchParams.get("ss")).toBe("Batumi, Georgia");
  });

  it("returns null for regions without a known accommodation city (e.g. Mtskheta/Gori day trips)", () => {
    expect(getAccommodationAffiliateLink("Mtskheta")).toBeNull();
    expect(getAccommodationAffiliateLink("Uplistsikhe")).toBeNull();
  });

  it("a multi-night stay: checkout reflects the full `nights` count, not just this day", () => {
    const link = getAccommodationAffiliateLink("Tbilisi", {
      dayNumber: 1,
      tripStartDateTime: "2026-08-01T10:00:00.000Z",
      nights: 3,
    });
    const parsed = new URL(link!.url);
    expect(parsed.searchParams.get("checkin")).toBe("2026-08-01");
    expect(parsed.searchParams.get("checkout")).toBe("2026-08-04");
  });
});
