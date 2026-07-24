import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, checkSupabaseRateLimit, getClientIp } from "@/lib/rateLimit";
import { submitItineraryToGallery } from "@/lib/supabase/itineraryRequests";

const shareRequestSchema = z.object({
  title: z.string().trim().min(3).max(120),
});

const shareRateLimit = {
  limit: 5,
  windowMs: 60 * 60 * 1000,
};

export async function POST(
  request: Request,
  { params }: { params: { shortId: string } },
) {
  const shortId = params.shortId?.trim();

  if (!shortId) {
    return NextResponse.json({ error: "Missing itinerary id." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title } = shareRequestSchema.parse(body);

    const rateLimitKey = `gallery-share:${getClientIp(request)}:${shortId}`;
    const inMemoryRateLimit = checkRateLimit(rateLimitKey, shareRateLimit);

    const durableRateLimit = inMemoryRateLimit.allowed
      ? await checkSupabaseRateLimit({ identifier: rateLimitKey, ...shareRateLimit })
      : inMemoryRateLimit;

    if (!durableRateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(durableRateLimit.retryAfterSeconds) },
        },
      );
    }

    const result = await submitItineraryToGallery(shortId, title);

    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            "This itinerary can't be submitted right now — it may already be shared, pending review, or not yet generated.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Invalid submission." },
        { status: 400 },
      );
    }

    console.error("Failed to submit itinerary to gallery:", error);
    return NextResponse.json(
      { error: "Unable to submit itinerary to gallery." },
      { status: 500 },
    );
  }
}
