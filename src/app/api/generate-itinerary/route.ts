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

function getRateLimitKey(request: Request, email: string): string {
  return `${getClientIp(request)}:${email.toLowerCase()}`;
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

  const inMemoryRateLimit = checkRateLimit(getRateLimitKey(request, formData.email), generationRateLimit);

  // In-memory check only catches bursts within the same warm instance;
  // the Supabase-backed check enforces the limit durably across instances/regions.
  const durableRateLimit = inMemoryRateLimit.allowed
    ? await checkSupabaseRateLimit({
        identifier: getRateLimitKey(request, formData.email),
        limit: generationRateLimit.limit,
        windowMs: generationRateLimit.windowMs,
      })
    : inMemoryRateLimit;

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

    return NextResponse.json(
      { success: true, data: itinerary, shareId: pendingRequest?.shortId ?? null },
      { status: 200 },
    );
  } catch (error) {
    console.error("Itinerary generation failed", getLoggableErrorDetails(error));

    const { status } = classifyError(error);
    const errorBody = buildErrorResponseBody(error);
    await tryUpdateRequest(itineraryRequestId, {
      status: "error",
      itinerary_result: null,
      error_message: errorBody.message,
    });

    return NextResponse.json(errorBody, { status });
  }
}
