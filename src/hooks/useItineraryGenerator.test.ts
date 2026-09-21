import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useItineraryGenerator } from "./useItineraryGenerator";
import type { TripFormData, ItineraryResult } from "@/types/trip";

const form: TripFormData = {
  days: 5, travelers: 2, tourType: "private-guided", budget: "medium", travelStyle: "balanced",
  travelDates: ["2026-10-01T10:00:00Z", "2026-10-05T10:00:00Z"],
  arrivalAirport: "Tbilisi International Airport", departureAirport: "Tbilisi International Airport",
  preferredCities: [], interests: [], email: "private@example.com", mobileNumber: "123456789",
  tourDescription: "Private request",
};
const itinerary: ItineraryResult = {
  tripTitle: "Private title", overview: "Private overview", days: [], totalPrice: "100",
  pricePerPerson: "50", estimatedBudget: "100", includedServices: [], notIncludedServices: [],
  bestFor: [], packingTips: [], transportTips: [], localFoodToTry: [], bookingSuggestion: "", overnightStayPlan: [],
};
const metrics = { trip_duration: 5, travelers_count: 2, tour_type: "private-guided" };
const gtag = vi.fn();
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); gtag.mockReset(); delete window.gtag; });

async function generate(response: Response | Error) {
  window.gtag = gtag;
  vi.stubGlobal("fetch", response instanceof Error ? vi.fn().mockRejectedValue(response) : vi.fn().mockResolvedValue(response));
  const hook = renderHook(useItineraryGenerator);
  await act(() => hook.result.current.generateItinerary(form));
  expect(gtag.mock.calls[0]).toEqual(["event", "itinerary_start", metrics]);
  expect(gtag).toHaveBeenCalledTimes(2);
  expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/private@example|123456789|Private|sensitive/);
  return hook;
}

it("tracks successful generation once and excludes form content", async () => {
  const hook = await generate(Response.json({ success: true, data: itinerary, shareId: null }));
  expect(hook.result.current.status).toBe("success");
  expect(gtag).toHaveBeenLastCalledWith("event", "itinerary_generate_success", metrics);
});

it.each([
  [429, { success: false, code: "RATE_LIMITED", message: "sensitive" }],
  [200, { success: false, code: "RATE_LIMITED", message: "sensitive" }],
  [429, null],
])("reports rate limiting exclusively for status %s", async (status, body) => {
  await generate(Response.json(body, { status }));
  expect(gtag).toHaveBeenLastCalledWith("event", "itinerary_rate_limited", {
    ...metrics, error_code: "RATE_LIMITED", http_status: status,
  });
});

it("reports API failure once and does not trust arbitrary error codes", async () => {
  await generate(Response.json({ success: false, code: "sensitive", message: "sensitive" }, { status: 500 }));
  expect(gtag).toHaveBeenLastCalledWith("event", "itinerary_generate_error", {
    ...metrics, error_code: "UNKNOWN", http_status: 500,
  });
});

it("rejects a malformed success response", async () => {
  const hook = await generate(Response.json({ success: true, data: {} }));
  expect(hook.result.current.status).toBe("error");
  expect(gtag).toHaveBeenLastCalledWith("event", "itinerary_generate_error", {
    ...metrics, error_code: "AI_INVALID_RESPONSE", http_status: 200,
  });
});

it("reports network failure", async () => {
  await generate(new TypeError("sensitive"));
  expect(gtag).toHaveBeenLastCalledWith("event", "itinerary_generate_error", {
    ...metrics, error_code: "NETWORK_ERROR", http_status: 0,
  });
});

it("prevents duplicate submissions before React rerenders and reports timeout once", async () => {
  vi.useFakeTimers();
  window.gtag = gtag;
  vi.stubGlobal("fetch", vi.fn((_url, { signal }: RequestInit) => new Promise((_resolve, reject) => {
    signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
  })));
  const hook = renderHook(useItineraryGenerator);
  await act(async () => {
    const first = hook.result.current.generateItinerary(form);
    await hook.result.current.generateItinerary(form);
    await vi.advanceTimersByTimeAsync(60_000);
    await first;
  });
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(gtag).toHaveBeenCalledTimes(2);
  expect(gtag).toHaveBeenLastCalledWith("event", "itinerary_generate_error", {
    ...metrics, error_code: "CLIENT_TIMEOUT", http_status: 0,
  });
});

it("continues generation when the analytics tag throws", async () => {
  window.gtag = () => { throw new Error("Analytics failed"); };
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ success: true, data: itinerary, shareId: null })));
  const hook = renderHook(useItineraryGenerator);
  await act(() => hook.result.current.generateItinerary(form));
  expect(hook.result.current.status).toBe("success");
});
