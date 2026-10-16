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

  it("never sends the traveler's contact details to the model", () => {
    const prompt = buildItineraryPrompt({ ...formData, mobileNumber: "+995 555 123 456" });

    expect(prompt).not.toContain("+995 555 123 456");
    expect(prompt).not.toContain(formData.email);
  });

  it("sends dates only when the form's flight times are placeholders", () => {
    const prompt = buildItineraryPrompt({ ...formData, flightTimesUnknown: true });

    expect(prompt).toContain("Arrival date: 2026-08-01 (flight time not provided");
    expect(prompt).toContain("Departure date: 2026-08-06 (flight time not provided");
    expect(prompt).not.toContain("T10:00:00");
    expect(prompt).not.toContain("T18:00:00");
  });
});
