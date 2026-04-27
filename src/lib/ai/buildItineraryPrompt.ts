import type { TripFormData } from "@/types/trip";

export function buildItineraryPrompt(formData: TripFormData): string {
  const [departureDateTime, arrivalDateTime] = formData.travelDates;

  return `You are a professional travel planner specializing in Georgia.

Create a personalized day-by-day travel itinerary based on the user's preferences.

User details:
- Trip length: ${formData.days} days
- Starting city: ${formData.startingCity}
- Departure date and time: ${departureDateTime}
- Arrival date and time: ${arrivalDateTime}
- Interests: ${formData.interests.join(", ")}
- Budget: ${formData.budget}
- Travel style: ${formData.travelStyle}
- Number of travelers: ${formData.travelers}
- Language: ${formData.language}

Rules:
- Focus only on realistic routes in Georgia.
- Avoid overloaded days.
- Do not include impossible routes for a normal tourist day.
- Include local food suggestions.
- Include practical travel notes when useful.
- Make the plan suitable for first-time visitors.
- Do not invent exact hotel names, booking availability, or exact ticket prices.
- Do not claim that bookings are confirmed.
- Return only valid JSON.
- The JSON must match the exact schema provided.

JSON shape:
{
  "tripTitle": "string",
  "overview": "string",
  "days": [
    {
      "day": 1,
      "title": "string",
      "region": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "foodSuggestion": "string",
      "travelTip": "string"
    }
  ],
  "estimatedBudget": "string",
  "bestFor": ["string"],
  "packingTips": ["string"],
  "transportTips": ["string"],
  "localFoodToTry": ["string"],
  "bookingSuggestion": "string"
}`;
}
