import { afterEach, describe, expect, it, vi } from "vitest";
import { analyticsPagePath, trackEvent } from "./analytics";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  delete window.gtag;
});

describe("trackEvent", () => {
  it("is safe during SSR", () => {
    vi.stubGlobal("window", undefined);
    expect(() => trackEvent("itinerary_start")).not.toThrow();
  });
  it("is safe without gtag", () => {
    delete window.gtag;
    expect(() => trackEvent("itinerary_start")).not.toThrow();
  });
  it("sends the event with supported values, without undefined or debug by default", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_DEBUG", "false");
    window.gtag = vi.fn();
    trackEvent("tour_click", { tour_slug: "kazbegi", count: 2, enabled: false, missing: undefined });
    expect(window.gtag).toHaveBeenCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith("event", "tour_click", {
      tour_slug: "kazbegi", count: 2, enabled: false,
    });
  });
  it("adds debug_mode only when explicitly enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_DEBUG", "true");
    window.gtag = vi.fn();
    trackEvent("itinerary_start");
    expect(window.gtag).toHaveBeenCalledWith("event", "itinerary_start", { debug_mode: true });
  });
  it("contains tag exceptions", () => {
    window.gtag = () => { throw new Error("tag failed"); };
    expect(() => trackEvent("whatsapp_click")).not.toThrow();
  });
  it("redacts private itinerary paths", () => {
    expect(analyticsPagePath("/itinerary/private-id")).toBe("/itinerary/[id]");
  });
});
