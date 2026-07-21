import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { tryCreatePendingRequest, tryUpdateRequest } from "./itineraryRequests";
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

describe("Supabase best-effort helpers", () => {
  const originalEnv = { ...process.env };
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
    consoleErrorSpy.mockRestore();
  });

  it("tryCreatePendingRequest swallows a Supabase failure and returns null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: "insert failed" }) }),
    );

    const result = await tryCreatePendingRequest(formData);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("tryCreatePendingRequest returns the created id and short id on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: "request-id-1", short_id: "short-id-1" }],
      }),
    );

    const result = await tryCreatePendingRequest(formData);

    expect(result).toEqual({ id: "request-id-1", shortId: "short-id-1" });
  });

  it("tryUpdateRequest never throws even when the update fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: "update failed" }) }),
    );

    await expect(
      tryUpdateRequest("request-id-1", { status: "success", itinerary_result: null, error_message: null }),
    ).resolves.toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("tryUpdateRequest is a no-op when there is no request id", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await tryUpdateRequest(null, { status: "success", itinerary_result: null, error_message: null });

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
