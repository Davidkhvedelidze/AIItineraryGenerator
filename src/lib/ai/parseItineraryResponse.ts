import type { ItineraryResult } from "@/types/trip";

function stripCodeFences(input: string): string {
  const trimmed = input.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

export function parseItineraryResponse(aiText: string): ItineraryResult {
  try {
    const jsonText = stripCodeFences(aiText);
    const parsed = JSON.parse(jsonText) as ItineraryResult;

    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.days)) {
      throw new Error("Parsed itinerary has invalid shape.");
    }

    return parsed;
  } catch {
    throw new Error("Unable to parse itinerary response.");
  }
}
