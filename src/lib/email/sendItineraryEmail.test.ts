import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ItineraryResult } from "@/lib/validations/itineraryResultSchema";
import { buildItineraryEmail, trySendItineraryEmail } from "./sendItineraryEmail";

const itinerary: ItineraryResult = {
  tripTitle: "Tbilisi & <Kazbegi>",
  overview: "Five easy days.",
  days: [
    {
      day: 1,
      title: "Old Tbilisi",
      region: "Tbilisi",
      morning: "Walk.",
      afternoon: "Baths.",
      evening: "Supra.",
      foodSuggestion: "Khinkali",
      travelTip: "Wear flats.",
      overnightStay: "Tbilisi",
    },
  ],
  totalPrice: "$900",
  pricePerPerson: "$450",
  estimatedBudget: "$900",
  includedServices: [],
  notIncludedServices: [],
  bestFor: [],
  packingTips: [],
  transportTips: [],
  localFoodToTry: [],
  bookingSuggestion: "",
  overnightStayPlan: [{ day: 1, city: "Tbilisi" }],
};

describe("buildItineraryEmail", () => {
  it("escapes model output and includes the share link", () => {
    const { subject, html, text } = buildItineraryEmail({
      itinerary,
      shareUrl: "https://tripmategeorgia.com/itinerary/abc",
    });

    expect(subject).toContain("Tbilisi & <Kazbegi>");
    expect(html).toContain("Tbilisi &amp; &lt;Kazbegi&gt;");
    expect(html).not.toContain("<Kazbegi>");
    expect(html).toContain('href="https://tripmategeorgia.com/itinerary/abc"');
    expect(text).toContain("Day 1 – Old Tbilisi (Tbilisi)");
  });

  it("omits the button when there is no saved itinerary page", () => {
    expect(buildItineraryEmail({ itinerary, shareUrl: null }).html).not.toContain("href=");
  });
});

describe("trySendItineraryEmail", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    fetchMock.mockReset();
  });

  it("skips sending when the provider isn't configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    await expect(trySendItineraryEmail({ to: "a@b.co", itinerary, shareUrl: null })).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the email to Resend", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ITINERARY_EMAIL_FROM", "TripMate Georgia <plans@tripmategeorgia.com>");
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));

    await expect(trySendItineraryEmail({ to: "a@b.co", itinerary, shareUrl: null })).resolves.toBe(true);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    expect(JSON.parse(init.body)).toMatchObject({
      from: "TripMate Georgia <plans@tripmategeorgia.com>",
      to: ["a@b.co"],
    });
  });

  it("never throws when the provider fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ITINERARY_EMAIL_FROM", "plans@tripmategeorgia.com");
    fetchMock.mockRejectedValue(new Error("network down"));

    await expect(trySendItineraryEmail({ to: "a@b.co", itinerary, shareUrl: null })).resolves.toBe(false);
  });
});
