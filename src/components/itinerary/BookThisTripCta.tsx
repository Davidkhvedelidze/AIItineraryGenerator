"use client";

import { useState } from "react";
import { Check, Loader2, MessageCircle, Send } from "lucide-react";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/contact";
import { cn } from "@/lib/utils";

type BookThisTripCtaProps = {
  shortId: string;
  pageUrl: string;
  /** "top" sits under the stats strip; "bottom" closes the page. Only changes spacing/copy. */
  placement: "top" | "bottom";
};

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The page's main conversion point: turns a generated itinerary into a priced private
 * trip request. The server already has the traveler's contact from the planner form.
 */
export function BookThisTripCta({ shortId, pageUrl, placement }: BookThisTripCtaProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function requestQuote() {
    setStatus("sending");
    setError(null);
    try {
      const response = await fetch(`/api/itinerary/${encodeURIComponent(shortId)}/quote-request`, {
        method: "POST",
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      trackEvent("generate_lead", { lead_type: "itinerary_quote", placement });
    } catch (caught) {
      setStatus("error");
      setError(
        caught instanceof Error
          ? caught.message
          : "We couldn't send your request. Please message us on WhatsApp.",
      );
    }
  }

  const whatsappUrl = buildWhatsAppUrl(
    `Hi! I'd like a price for this Georgia itinerary with a private driver: ${pageUrl}`,
  );

  return (
    <section
      aria-label="Book this trip"
      className={cn("container", placement === "top" ? "pt-8" : "pb-12 pt-4")}
    >
      <div className="grid gap-6 rounded-3xl bg-foreground p-6 text-background shadow-xl sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {placement === "top" ? "Like this plan?" : "Ready to go?"}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight sm:text-3xl">
            Book this route with a private driver
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-background/75">
            Our local team prices this exact itinerary: hotel pickup, an English-speaking
            driver, and changes whenever you want. We reply within a few hours.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {status === "sent" ? (
            <p
              role="status"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-background/10 px-6 text-sm font-semibold"
            >
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
              Request sent. We&apos;ll be in touch soon.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => void requestQuote()}
              disabled={status === "sending"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-70"
            >
              {status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              Get my price
            </button>
          )}
          <WhatsAppLink
            clickLocation="itinerary_quote"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-background/25 px-6 text-sm font-semibold transition hover:bg-background/10"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Ask on WhatsApp
          </WhatsAppLink>
          {status === "error" && error ? (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
