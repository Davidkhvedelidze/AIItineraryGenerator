import type OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { AiInvalidResponseError, AiTimeoutError } from "@/lib/api/apiError";
import { buildItineraryPrompt } from "@/lib/ai/buildItineraryPrompt";
import { parseItineraryResponse } from "@/lib/ai/parseItineraryResponse";
import { itineraryResultSchema, type ItineraryResult } from "@/lib/validations/itineraryResultSchema";
import type { TripFormData } from "@/types/trip";

const TIMEOUT_MS = (() => {
  const parsed = Number.parseInt(process.env.OPENAI_TIMEOUT_MS ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 45_000;
})();

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

async function requestCompletion(client: OpenAI, prompt: string): Promise<ItineraryResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const completion = await client.chat.completions.create(
      {
        model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
        messages: [
          { role: "system", content: "Return only strict JSON matching the given schema." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        response_format: zodResponseFormat(itineraryResultSchema, "itinerary_result"),
      },
      { signal: controller.signal },
    );

    const aiText = completion.choices[0]?.message?.content;

    if (!aiText) {
      throw new AiInvalidResponseError("No itinerary generated.");
    }

    // response_format already enforces the JSON schema server-side; parsing
    // and re-validating here is a defensive fallback, not the primary contract.
    const parsed = parseItineraryResponse(aiText);
    const validated = itineraryResultSchema.safeParse(parsed);

    if (!validated.success) {
      throw new AiInvalidResponseError();
    }

    return validated.data;
  } catch (error) {
    if (isAbortError(error)) {
      throw new AiTimeoutError();
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function isTransientError(error: unknown): boolean {
  if (error instanceof AiTimeoutError || error instanceof AiInvalidResponseError) {
    return true;
  }

  const apiError = error as { status?: number; message?: string };
  return (apiError.status !== undefined && apiError.status >= 500) || apiError.message === "Connection error.";
}

/**
 * Generates and validates an itinerary. Allows exactly one controlled retry
 * for transient failures (timeout, malformed model output, upstream 5xx /
 * connection errors) — never retries on non-transient errors like missing
 * config, auth failures, or exhausted quota.
 */
export async function generateItineraryCompletion(
  client: OpenAI,
  formData: TripFormData,
): Promise<ItineraryResult> {
  const prompt = buildItineraryPrompt(formData);

  try {
    return await requestCompletion(client, prompt);
  } catch (error) {
    if (!isTransientError(error)) {
      throw error;
    }

    return requestCompletion(client, prompt);
  }
}
