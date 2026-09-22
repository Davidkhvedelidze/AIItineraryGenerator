"use client";

import { useEffect, useRef, useState } from "react";

/** Stable across loads — only the custom element's tag-name suffix (e.g. emerald-block_dz57bzw) is randomized. */
const WIDGET_SELECTOR = ".emerald-block";

/**
 * The Travelpayouts automonetization script (tp-em.com, loaded in layout.tsx)
 * injects a "Top hotels" widget at an unpredictable DOM location client-side
 * (observed landing mid-flex-row inside the first Highlights card, breaking
 * its layout). It never appears on localhost, only on the live domain.
 *
 * This relocates the widget — whenever and wherever it lands — into a proper
 * section that matches the page design, by moving the actual DOM node (safe
 * for a Shadow DOM host: appendChild preserves its shadow root and listeners).
 * If the widget never fires, the section stays hidden.
 */
export function TourHotelWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWidget, setHasWidget] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function adopt(node: Element) {
      if (!container || container.contains(node)) return;
      container.appendChild(node);
      setHasWidget(true);
    }

    const existing = document.querySelector(WIDGET_SELECTOR);
    if (existing) adopt(existing);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(WIDGET_SELECTOR)) {
            adopt(node);
          } else {
            const nested = node.querySelector(WIDGET_SELECTOR);
            if (nested) adopt(nested);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="hotel-recommendations"
      className={`scroll-mt-24 space-y-5 ${hasWidget ? "" : "hidden"}`}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Where to stay
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Top hotels in the area
        </h2>
      </div>
      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl border bg-card p-1"
      />
    </section>
  );
}
