import { describe, expect, it } from "vitest";
import { itineraryResultSchema } from "./itineraryResultSchema";

const validItinerary = {
  tripTitle: "Georgia Highlights",
  overview: "A week across Tbilisi, Kazbegi, and Kakheti.",
  days: [
    {
      day: 1,
      title: "Arrival in Tbilisi",
      region: "Tbilisi",
      morning: "Airport pickup",
      afternoon: "Old Town walk",
      evening: "Welcome dinner",
      foodSuggestion: "Khachapuri",
      travelTip: "Carry cash for small vendors",
    },
  ],
  totalPrice: "$1200",
  pricePerPerson: "$600",
  estimatedBudget: "medium",
  includedServices: ["Guide", "Driver"],
  notIncludedServices: ["Meals"],
  bestFor: ["Couples"],
  packingTips: ["Comfortable shoes"],
  transportTips: ["Book transfers ahead"],
  localFoodToTry: ["Khinkali"],
  bookingSuggestion: "Book 2 weeks in advance.",
};

describe("itineraryResultSchema", () => {
  it("accepts a valid itinerary payload", () => {
    expect(itineraryResultSchema.safeParse(validItinerary).success).toBe(true);
  });

  it("rejects a payload missing required fields", () => {
    const withoutTitle: Record<string, unknown> = { ...validItinerary };
    delete withoutTitle.tripTitle;

    expect(itineraryResultSchema.safeParse(withoutTitle).success).toBe(false);
  });

  it("rejects a payload with wrong field types", () => {
    const result = itineraryResultSchema.safeParse({
      ...validItinerary,
      days: [{ ...validItinerary.days[0], day: "one" }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a non-object payload", () => {
    expect(itineraryResultSchema.safeParse("not an itinerary").success).toBe(
      false,
    );
  });
});
