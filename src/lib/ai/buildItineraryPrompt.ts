import type { TripFormData } from "@/types/trip";

export function buildItineraryPrompt(formData: TripFormData): string {
  const [departureDateTime, arrivalDateTime] = formData.travelDates;

  return `You are a professional travel planner specializing in Georgia.

Create a personalized day-by-day travel itinerary based on the user's preferences.

User details:
- Trip length: ${formData.days} days
- Arrival airport: ${formData.arrivalAirport}
- Departure airport: ${formData.departureAirport}
- Departure date and time: ${departureDateTime}
- Arrival date and time: ${arrivalDateTime}
- Preferred overnight cities: ${formData.preferredCities.join(", ")}
- Interests: ${formData.interests.join(", ")}
- Budget: ${formData.budget}
- Travel style: ${formData.travelStyle}
- Number of travelers: ${formData.travelers}
- Language: ${formData.language}
- Mobile number: ${formData.mobileNumber || "Not provided"}
- Customer tour description: ${formData.tourDescription || "Not provided"}

Rules:
- Focus only on realistic routes in Georgia.
- Prioritize the customer's tour description when it is provided, while still keeping the route realistic.
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
