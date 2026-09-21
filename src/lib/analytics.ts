export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

export type AnalyticsEventName =
  | "page_view"
  | "itinerary_start"
  | "itinerary_generate_success"
  | "itinerary_generate_error"
  | "itinerary_rate_limited"
  | "whatsapp_click"
  | "tour_click"
  | "booking_email_click"
  | "itinerary_pdf_download_click";

/** Callers must supply only non-sensitive, controlled values. */
export function trackEvent(eventName: AnalyticsEventName, parameters?: AnalyticsEventParams): void {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const params = Object.fromEntries(
      Object.entries(parameters ?? {}).filter(([, value]) => value !== undefined),
    );
    if (process.env.NEXT_PUBLIC_GA_DEBUG === "true") params.debug_mode = true;
    window.gtag("event", eventName, params);
  } catch {
    // Analytics is best-effort and must never interrupt navigation or generation.
  }
}

/** Exclude query strings, fragments and private itinerary identifiers. */
export function analyticsPagePath(pathname: string): string {
  if (pathname.startsWith("/itinerary/")) return "/itinerary/[id]";
  if (pathname.startsWith("/admin")) return "/admin";
  return pathname;
}
