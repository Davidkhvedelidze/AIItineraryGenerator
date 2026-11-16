import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  AiNotConfiguredError,
  buildErrorResponseBody,
  buildErrorResponseBodyForCode,
  classifyError,
  getLoggableErrorDetails,
} from "@/lib/api/apiError";
import { generateItineraryCompletion } from "@/lib/ai/generateItineraryCompletion";
import { trySendItineraryEmail } from "@/lib/email/sendItineraryEmail";
import { plannerLead, trySendLeadNotification } from "@/lib/email/sendLeadNotification";
import { getSiteUrl } from "@/lib/site";
import { checkRateLimit, checkSupabaseRateLimit, getClientIp } from "@/lib/rateLimit";
import { tryCreatePendingRequest, tryUpdateRequest } from "@/lib/supabase/itineraryRequests";
import { tripFormSchema } from "@/lib/validations/tripFormSchema";

function readPositiveIntegerEnv(name: string, fallback: number): number {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const generationRateLimit = {
  limit: readPositiveIntegerEnv("ITINERARY_RATE_LIMIT", 10),
  windowMs: readPositiveIntegerEnv("ITINERARY_RATE_LIMIT_WINDOW_SECONDS", 15 * 60) * 1000,
};

// Per-IP cap that rotating email addresses can't bypass (generous enough for shared NAT/office IPs).
const ipRateLimit = {
  limit: readPositiveIntegerEnv("ITINERARY_IP_RATE_LIMIT", 20),
  windowMs: readPositiveIntegerEnv("ITINERARY_IP_RATE_LIMIT_WINDOW_SECONDS", 60 * 60) * 1000,
};

// Site-wide ceiling on OpenAI calls per day: a hard stop on spend if a bot farm gets through.
const globalDailyLimit = {
  limit: readPositiveIntegerEnv("ITINERARY_GLOBAL_DAILY_LIMIT", 500),
  windowMs: 24 * 60 * 60 * 1000,
};

function getRateLimitKey(request: Request, email: string): string {
  return `${getClientIp(request)}:${email.toLowerCase()}`;
}

type RateLimitOutcome = { allowed: boolean; retryAfterSeconds: number };

async function checkLimit(
  key: string,
  options: { limit: number; windowMs: number },
): Promise<RateLimitOutcome> {
  const inMemory = checkRateLimit(key, options);

  // In-memory check only catches bursts within the same warm instance;
  // the Supabase-backed check enforces the limit durably across instances/regions.
  return inMemory.allowed
    ? checkSupabaseRateLimit({ identifier: key, limit: options.limit, windowMs: options.windowMs })
    : inMemory;
}

/** Cheapest/most specific checks first, so a blocked caller never consumes the global budget. */
async function checkGenerationLimits(request: Request, email: string): Promise<RateLimitOutcome> {
  const checks: Array<[string, { limit: number; windowMs: number }]> = [
    [getRateLimitKey(request, email), generationRateLimit],
    [`itinerary-ip:${getClientIp(request)}`, ipRateLimit],
    ["itinerary-global-daily", globalDailyLimit],
  ];

  for (const [key, options] of checks) {
    const result = await checkLimit(key, options);
    if (!result.allowed) return result;
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(buildErrorResponseBodyForCode("INVALID_REQUEST"), { status: 400 });
  }

  const validatedForm = tripFormSchema.safeParse(body);

  if (!validatedForm.success) {
    return NextResponse.json(buildErrorResponseBodyForCode("INVALID_REQUEST"), { status: 400 });
  }

  const formData = validatedForm.data;

  const durableRateLimit = await checkGenerationLimits(request, formData.email);

  if (!durableRateLimit.allowed) {
    return NextResponse.json(buildErrorResponseBodyForCode("RATE_LIMITED"), {
      status: 429,
      headers: { "Retry-After": String(durableRateLimit.retryAfterSeconds) },
    });
  }

  // Best-effort: a Supabase outage must not block itinerary generation.
  const pendingRequest = await tryCreatePendingRequest(formData);
  const itineraryRequestId = pendingRequest?.id ?? null;

  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      console.error("Itinerary generation misconfigured: OPENAI_API_KEY is missing.");
      throw new AiNotConfiguredError();
    }

    const client = new OpenAI({ apiKey });
    const itinerary = await generateItineraryCompletion(client, formData);

    await tryUpdateRequest(itineraryRequestId, {
      status: "success",
      itinerary_result: itinerary,
      error_message: null,
    });

    // Awaited rather than fire-and-forget: serverless functions may freeze once the response is sent.
    const shortId = pendingRequest?.shortId;
    const shareUrl = shortId ? `${getSiteUrl()}/itinerary/${shortId}` : null;
    const [emailSent] = await Promise.all([
      trySendItineraryEmail({ to: formData.email, itinerary, shareUrl }),
      trySendLeadNotification(
        plannerLead(formData, { tripTitle: itinerary.tripTitle, itineraryUrl: shareUrl }),
      ),
    ]);

    return NextResponse.json(
      { success: true, data: itinerary, shareId: pendingRequest?.shortId ?? null, emailSent },
      { status: 200 },
    );
  } catch (error) {
    console.error("Itinerary generation failed", getLoggableErrorDetails(error));

    const { status } = classifyError(error);
    const errorBody = buildErrorResponseBody(error);
    await Promise.all([
      tryUpdateRequest(itineraryRequestId, {
        status: "error",
        itinerary_result: null,
        error_message: errorBody.message,
      }),
      // The traveler left their contact even though generation failed: still a lead.
      trySendLeadNotification(plannerLead(formData, { generationFailed: true })),
    ]);

    return NextResponse.json(errorBody, { status });
  }
}
