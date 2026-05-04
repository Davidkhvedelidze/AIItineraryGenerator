import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { buildItineraryPrompt } from "@/lib/ai/buildItineraryPrompt";
import { parseItineraryResponse } from "@/lib/ai/parseItineraryResponse";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  createItineraryRequest,
  updateItineraryRequest,
} from "@/lib/supabase/itineraryRequests";
import { tripFormSchema } from "@/lib/validations/tripFormSchema";

function readPositiveIntegerEnv(name: string, fallback: number): number {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const generationRateLimit = {
  limit: readPositiveIntegerEnv("ITINERARY_RATE_LIMIT", 10),
  windowMs: readPositiveIntegerEnv("ITINERARY_RATE_LIMIT_WINDOW_SECONDS", 15 * 60) * 1000,
};

const itineraryResultSchema = z.object({
  tripTitle: z.string(),
  overview: z.string(),
  days: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      region: z.string(),
      morning: z.string(),
      afternoon: z.string(),
      evening: z.string(),
      foodSuggestion: z.string(),
      travelTip: z.string()
    })
  ),
  totalPrice: z.string(),
  pricePerPerson: z.string(),
  estimatedBudget: z.string(),
  includedServices: z.array(z.string()),
  notIncludedServices: z.array(z.string()),
  bestFor: z.array(z.string()),
  packingTips: z.array(z.string()),
  transportTips: z.array(z.string()),
  localFoodToTry: z.array(z.string()),
  bookingSuggestion: z.string()
});

function getApiErrorMessage(error: unknown): string {
  const apiError = error as { status?: number; code?: string; message?: string };

  if (apiError.status === 401) {
    return "OpenAI rejected the API key. Please check or replace OPENAI_API_KEY.";
  }

  if (apiError.status === 429 || apiError.code === "insufficient_quota") {
    return "OpenAI quota is exceeded. Please check billing, credits, or project limits for this API key.";
  }

  if (apiError.message === "Connection error.") {
    return "Unable to connect to OpenAI right now. Please check network access and try again.";
  }

  if (apiError.message?.startsWith("Unable to save itinerary request")) {
    return "Unable to save your request right now. Please try again in a few minutes.";
  }

  if (
    apiError.message?.startsWith("AI itinerary generation is not configured") ||
    apiError.message === "No itinerary generated." ||
    apiError.message === "Received invalid itinerary format."
  ) {
    return apiError.message;
  }

  return "Unable to generate itinerary right now.";
}

function getApiErrorStatus(error: unknown): number {
  const apiError = error as { status?: number; code?: string; message?: string };

  if (apiError.status === 401) {
    return 401;
  }

  if (apiError.status === 429 || apiError.code === "insufficient_quota") {
    return 429;
  }

  if (apiError.message === "Connection error.") {
    return 502;
  }

  return 500;
}

function redactSecrets(message: string | undefined): string | undefined {
  return message?.replace(/Bearer\s+[^'\s]+/g, "Bearer [redacted]");
}

function getLoggableErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { error };
  }

  const apiError = error as Error & {
    status?: number;
    code?: string;
    type?: string;
    cause?: unknown;
  };
  const cause =
    apiError.cause instanceof Error
      ? {
          name: apiError.cause.name,
          message: redactSecrets(apiError.cause.message),
          code: (apiError.cause as Error & { code?: string }).code,
        }
      : apiError.cause;

  return {
    name: apiError.name,
    message: redactSecrets(apiError.message),
    status: apiError.status,
    code: apiError.code,
    type: apiError.type,
    cause,
  };
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function getRateLimitKey(request: Request, email: string): string {
  return `${getClientIp(request)}:${email.toLowerCase()}`;
}

function getApiErrorResponse(error: unknown) {
  return NextResponse.json(
    { success: false, message: getApiErrorMessage(error) },
    { status: getApiErrorStatus(error) }
  );
}

async function markItineraryRequestError(requestId: string | null, error: unknown) {
  try {
    await updateItineraryRequest(requestId, {
      status: "error",
      itinerary_result: null,
      error_message: getApiErrorMessage(error),
    });
  } catch {
    // Keep the original generation error as the API response.
  }
}

export async function POST(request: Request) {
  let itineraryRequestId: string | null = null;

  try {
    const body = await request.json();
    const validatedForm = tripFormSchema.safeParse(body);

    if (!validatedForm.success) {
      return NextResponse.json({ success: false, message: "Invalid request data." }, { status: 400 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitKey(request, validatedForm.data.email),
      generationRateLimit,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many itinerary requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    itineraryRequestId = await createItineraryRequest(validatedForm.data);

    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      const error = new Error("AI itinerary generation is not configured yet. Please add an OpenAI API key.");
      await markItineraryRequestError(itineraryRequestId, error);
      return NextResponse.json(
        { success: false, message: "AI itinerary generation is not configured yet. Please add an OpenAI API key." },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });
    const prompt = buildItineraryPrompt(validatedForm.data);

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return only strict JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const aiText = completion.choices[0]?.message?.content;

    if (!aiText) {
      await updateItineraryRequest(itineraryRequestId, {
        status: "error",
        itinerary_result: null,
        error_message: "No itinerary generated.",
      });
      return NextResponse.json({ success: false, message: "No itinerary generated." }, { status: 502 });
    }

    const parsed = parseItineraryResponse(aiText);
    const validatedItinerary = itineraryResultSchema.safeParse(parsed);

    if (!validatedItinerary.success) {
      await updateItineraryRequest(itineraryRequestId, {
        status: "error",
        itinerary_result: null,
        error_message: "Received invalid itinerary format.",
      });
      return NextResponse.json({ success: false, message: "Received invalid itinerary format." }, { status: 502 });
    }

    await updateItineraryRequest(itineraryRequestId, {
      status: "success",
      itinerary_result: validatedItinerary.data,
      error_message: null,
    });

    return NextResponse.json({ success: true, data: validatedItinerary.data }, { status: 200 });
  } catch (error) {
    console.error("Itinerary generation failed", getLoggableErrorDetails(error));
    await markItineraryRequestError(itineraryRequestId, error);
    return getApiErrorResponse(error);
  }
}
