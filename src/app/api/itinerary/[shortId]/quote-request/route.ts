import { NextResponse } from "next/server";
import { plannerLead, trySendLeadNotification } from "@/lib/email/sendLeadNotification";
import { checkRateLimit, checkSupabaseRateLimit } from "@/lib/rateLimit";
import { getSiteUrl } from "@/lib/site";
import { getItineraryRequestByShortId } from "@/lib/supabase/itineraryRequests";

const quoteRateLimit = {
  limit: 3,
  windowMs: 60 * 60 * 1000,
};

/**
 * "Get my price" on an itinerary page. The traveler's contact details are read from the
 * stored request on the server and only emailed to the team, never returned to the client.
 */
export async function POST(
  _request: Request,
  { params }: { params: { shortId: string } },
) {
  const shortId = params.shortId?.trim();

  if (!shortId) {
    return NextResponse.json({ error: "Missing itinerary id." }, { status: 400 });
  }

  const rateLimitKey = `itinerary-quote:${shortId}`;
  const inMemoryRateLimit = checkRateLimit(rateLimitKey, quoteRateLimit);
  const durableRateLimit = inMemoryRateLimit.allowed
    ? await checkSupabaseRateLimit({ identifier: rateLimitKey, ...quoteRateLimit })
    : inMemoryRateLimit;

  if (!durableRateLimit.allowed) {
    // Already requested recently: the team has it, so treat a repeat click as success.
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const stored = await getItineraryRequestByShortId(shortId);

  if (!stored || stored.status !== "success") {
    return NextResponse.json({ error: "Itinerary not found." }, { status: 404 });
  }

  const sent = await trySendLeadNotification(
    plannerLead(stored.form_data, {
      type: "itinerary_quote",
      tripTitle: stored.itinerary_result?.tripTitle,
      itineraryUrl: `${getSiteUrl()}/itinerary/${encodeURIComponent(shortId)}`,
    }),
  );

  if (!sent) {
    return NextResponse.json(
      { error: "We couldn't send your request. Please message us on WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
