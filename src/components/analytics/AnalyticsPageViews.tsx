"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analyticsPagePath, trackEvent } from "@/lib/analytics";

/** Requires GA4 Enhanced Measurement automatic page views to be disabled. */
export function AnalyticsPageViews({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigationKey = `${pathname}?${searchParams.toString()}`;
  const previous = useRef<{ key: string; location: string } | null>(null);

  useEffect(() => {
    if (!ready || !pathname || previous.current?.key === navigationKey) return;
    if (typeof window.gtag !== "function") return;
    const path = analyticsPagePath(pathname);
    const location = `${window.location.origin}${path}`;
    const params = {
      page_location: location,
      page_referrer: previous.current?.location ?? "",
      page_title: `TripMate Georgia | ${path}`,
    };
    try {
      // Also sanitize the page context inherited by subsequent custom events.
      window.gtag("set", params);
    } catch {
      // A broken tag must not affect the application.
    }
    trackEvent("page_view", params);
    previous.current = { key: navigationKey, location };
  }, [ready, pathname, navigationKey]);

  return null;
}
