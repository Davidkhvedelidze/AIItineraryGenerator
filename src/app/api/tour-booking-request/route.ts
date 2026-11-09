import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, checkSupabaseRateLimit, getClientIp } from "@/lib/rateLimit";
import { createTourBookingRequest } from "@/lib/supabase/tourBookingRequests";
import { trySendLeadNotification } from "@/lib/email/sendLeadNotification";
import { getSiteUrl } from "@/lib/site";

const tourBookingRequestSchema = z
  .object({
    tourSlug: z.string().min(1),
    tourTitle: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email().optional().nullable(),
    whatsapp: z.string().optional().nullable(),
    travelDate: z.string().optional().nullable(),
    travelers: z.number().int().min(1).optional().nullable(),
    pickupLocation: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
  })
  .refine((data) => Boolean(data.email || data.whatsapp), {
    message: "Email or WhatsApp is required.",
    path: ["whatsapp"],
  });

function readPositiveIntegerEnv(name: string, fallback: number): number {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const bookingRateLimit = {
  limit: readPositiveIntegerEnv("TOUR_BOOKING_RATE_LIMIT", 5),
  windowMs: readPositiveIntegerEnv("TOUR_BOOKING_RATE_LIMIT_WINDOW_SECONDS", 15 * 60) * 1000,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = tourBookingRequestSchema.parse(body);

    const contactKey = (payload.email || payload.whatsapp || "").toLowerCase();
    const inMemoryRateLimit = checkRateLimit(`${getClientIp(request)}:${contactKey}`, bookingRateLimit);

    const durableRateLimit = inMemoryRateLimit.allowed
      ? await checkSupabaseRateLimit({
          identifier: `${getClientIp(request)}:${contactKey}`,
          limit: bookingRateLimit.limit,
          windowMs: bookingRateLimit.windowMs,
        })
      : inMemoryRateLimit;

    if (!durableRateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many booking requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(durableRateLimit.retryAfterSeconds) },
        },
      );
    }

    // Saving and notifying are both best-effort; the lead is only lost if both fail.
    const [saved, notified] = await Promise.all([
      createTourBookingRequest(payload).then(
        (requestId) => ({ ok: requestId !== null, requestId }),
        (error: unknown) => {
          console.error("Failed to save tour booking request:", error);
          return { ok: false, requestId: null };
        },
      ),
      trySendLeadNotification({
        type: "tour_booking",
        headline: payload.tourTitle,
        name: payload.name,
        email: payload.email,
        whatsapp: payload.whatsapp,
        travelers: payload.travelers,
        startDate: payload.travelDate,
        details: [["Pickup", payload.pickupLocation]],
        note: payload.message,
        link: {
          label: "Open tour page",
          url: `${getSiteUrl()}/tours/${encodeURIComponent(payload.tourSlug)}`,
        },
      }),
    ]);

    if (!saved.ok && !notified) {
      return NextResponse.json(
        { error: "Unable to save booking request." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, requestId: saved.requestId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Invalid booking request." },
        { status: 400 },
      );
    }

    console.error("Failed to save tour booking request:", error);
    return NextResponse.json(
      { error: "Unable to save booking request." },
      { status: 500 },
    );
  }
}
