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

  it("includes a WhatsApp contact prefilled with the itinerary link", () => {
    const shareUrl = "https://tripmategeorgia.com/itinerary/abc";
    const { html, text } = buildItineraryEmail({ itinerary, shareUrl });
    const expectedUrl = `https://wa.me/995551181358?text=${encodeURIComponent(
      `Hi! I have a question about my Georgia itinerary: ${shareUrl}`,
    )}`;

    expect(html).toContain(`href="${expectedUrl}"`);
    expect(html).toContain("+995 551 18 13 58");
    expect(text).toContain(`+995 551 18 13 58 (${expectedUrl})`);
    expect(text).not.toContain("reply to this email");
  });

  it("omits the itinerary link when there is no saved itinerary page", () => {
    const { html } = buildItineraryEmail({ itinerary, shareUrl: null });

    expect(html).not.toContain("full day-by-day plan");
    expect(html).toContain("https://wa.me/995551181358");
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
