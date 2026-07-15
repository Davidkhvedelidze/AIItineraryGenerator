import { describe, expect, it } from "vitest";
import { buildItineraryPrompt } from "./buildItineraryPrompt";
import type { TripFormData } from "@/types/trip";

const formData: TripFormData = {
  days: 5,
  travelDates: ["2026-08-01T10:00:00.000Z", "2026-08-06T18:00:00.000Z"],
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

describe("buildItineraryPrompt date ordering", () => {
  it("labels the earlier travelDates entry as arrival and the later one as departure", () => {
    const prompt = buildItineraryPrompt(formData);

    const arrivalIndex = prompt.indexOf(`Arrival date and time: ${formData.travelDates[0]}`);
    const departureIndex = prompt.indexOf(`Departure date and time: ${formData.travelDates[1]}`);

    expect(arrivalIndex).toBeGreaterThan(-1);
    expect(departureIndex).toBeGreaterThan(-1);
    expect(arrivalIndex).toBeLessThan(departureIndex);
  });
});
