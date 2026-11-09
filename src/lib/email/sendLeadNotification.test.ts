import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildLeadNotificationEmail,
  plannerLead,
  toWhatsAppChatUrl,
  trySendLeadNotification,
  type Lead,
} from "./sendLeadNotification";

const tourLead: Lead = {
  type: "tour_booking",
  headline: "Kazbegi day tour",
  name: "Sara <script>",
  email: "sara@example.com",
  whatsapp: "+971 50 123 4567",
  travelers: 2,
  startDate: "2027-03-12",
  details: [["Pickup", "Hotel in Old Tbilisi"], ["Empty", ""]],
  note: "Traveling with a toddler",
};

describe("toWhatsAppChatUrl", () => {
  it("normalizes international numbers", () => {
    expect(toWhatsAppChatUrl("+971 50 123 4567")).toBe("https://wa.me/971501234567");
    expect(toWhatsAppChatUrl("00995 551 18 13 58")).toBe("https://wa.me/995551181358");
  });

  it("ignores missing or too-short values", () => {
    expect(toWhatsAppChatUrl(null)).toBeNull();
    expect(toWhatsAppChatUrl("12-34")).toBeNull();
  });
});

describe("buildLeadNotificationEmail", () => {
  it("puts the essentials in the subject", () => {
    const { subject } = buildLeadNotificationEmail(tourLead);
    expect(subject).toBe("🔔 New lead · Kazbegi day tour · 2 travelers · Mar 12, 2027");
  });

  it("includes contact rows, note and a WhatsApp reply link, and escapes HTML", () => {
    const { html, text } = buildLeadNotificationEmail(tourLead);
    expect(text).toContain("Email: sara@example.com");
    expect(text).toContain("Pickup: Hotel in Old Tbilisi");
    expect(text).not.toContain("Empty:");
    expect(text).toContain("Traveling with a toddler");
    expect(html).toContain("https://wa.me/971501234567");
    expect(html).toContain("Sara &lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("flags failed planner generations", () => {
    const lead = plannerLead(
      {
        email: "a@b.co",
        mobileNumber: undefined,
        travelers: 3,
        travelDates: ["2027-05-01T10:00:00.000Z", "2027-05-07T18:00:00.000Z"],
        days: 7,
        interests: ["wine", "mountains"] as never,
        budget: "medium",
        travelStyle: "balanced",
        tourType: "private-guided" as never,
        preferredCities: ["Tbilisi"] as never,
        arrivalAirport: "Tbilisi International Airport" as never,
        tourDescription: "",
      },
      { generationFailed: true },
    );
    const { subject, text } = buildLeadNotificationEmail(lead);
    expect(subject).toBe("🔔 New lead · 7-day Georgia trip · 3 travelers · May 1, 2027");
    expect(text).toContain("Dates: May 1, 2027 – May 7, 2027");
    expect(text).toContain("AI generation FAILED");
    expect(text).not.toContain("Reply on WhatsApp");
  });
});

describe("trySendLeadNotification", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ITINERARY_EMAIL_FROM", "TripMate <plans@tripmategeorgia.com>");
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends to LEAD_NOTIFY_EMAIL with the traveler as reply-to", async () => {
    vi.stubEnv("LEAD_NOTIFY_EMAIL", "owner@example.com");
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));

    await expect(trySendLeadNotification(tourLead)).resolves.toBe(true);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({ to: ["owner@example.com"], reply_to: "sara@example.com" });
  });

  it("falls back to the public contact address", async () => {
    vi.stubEnv("LEAD_NOTIFY_EMAIL", "");
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));

    await trySendLeadNotification({ ...tourLead, email: null });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.to).toEqual(["info@mustseegeorgia.com"]);
    expect(body.reply_to).toBeUndefined();
  });
});
