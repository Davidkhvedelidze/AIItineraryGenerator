import type { TripFormData } from "@/types/trip";

const tourTypeLabels: Record<TripFormData["tourType"], string> = {
  "private-guided": "Private guided tour",
  "public-group": "Public group tour",
  "self-guided": "Self-guided tour by the customer",
};

function buildTourTypeRules(formData: TripFormData): string {
  if (formData.tourType === "private-guided") {
    return `Private custom tour offer rules:
- Create a private Georgia tour itinerary for ${formData.travelers} guests from ${formData.travelDates[0]} to ${formData.travelDates[1]}.
- Write as the private guide and driver using your own car.
- Treat preferred overnight cities and customer tour description as the overnight schedule when specific nights are provided.
- Treat the customer tour description as the source for places to include when provided.
- Generate a customer-ready offer with a short intro, day-by-day itinerary, overnight locations, total price, price per person, included services, not included services, and a WhatsApp-friendly tone.
- The price must include private guide/driver service, car, fuel, airport transfers, route planning, and the guide's travel expenses.
- Do not include hotels, meals, entrance tickets, wine tastings, or personal expenses in the price.
- If exact rates are not provided, provide a realistic estimated quote or price range and say it is subject to final confirmation.
- Make it professional, short, realistic, and ready to send.`;
  }

  if (formData.tourType === "public-group") {
    return `Public group tour rules:
- Create a shared group-style itinerary and avoid presenting the guide/driver or car as exclusively private.
- Price fields should be realistic estimates for a public/shared option and must say that final availability and group pricing need confirmation.
- Included and not included services must match a public group tour, not a private car tour.`;
  }

  return `Self-guided tour rules:
- Create an itinerary the customer can do by themselves without a private guide or driver.
- Price fields should estimate self-guided travel costs only, such as transport ranges or planning budget, and must not include private guide/driver service.
- Included services should focus on route planning guidance; not included services should include hotels, meals, entrance tickets, transport bookings, and personal expenses unless explicitly requested.`;
}

export function buildItineraryPrompt(formData: TripFormData): string {
  const [arrivalDateTime, departureDateTime] = formData.travelDates;

  return `You are a professional travel planner specializing in Georgia.

Create a personalized day-by-day travel itinerary based on the user's preferences.

User details:
- Trip length: ${formData.days} days
- Arrival airport: ${formData.arrivalAirport}
- Departure airport: ${formData.departureAirport}
- Arrival date and time: ${arrivalDateTime}
- Departure date and time: ${departureDateTime}
- Preferred overnight cities: ${formData.preferredCities.join(", ")}
- Interests: ${formData.interests.join(", ")}
- Budget: ${formData.budget}
- Travel style: ${formData.travelStyle}
- Tour type: ${tourTypeLabels[formData.tourType]}
- Number of travelers: ${formData.travelers}
- Language: ${formData.language}
- Mobile number: ${formData.mobileNumber || "Not provided"}
- Customer tour description: ${formData.tourDescription || "Not provided"}

${buildTourTypeRules(formData)}

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
- Keep the tone concise, professional, and WhatsApp-friendly.
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
  "totalPrice": "string",
  "pricePerPerson": "string",
  "estimatedBudget": "string",
  "includedServices": ["string"],
  "notIncludedServices": ["string"],
  "bestFor": ["string"],
  "packingTips": ["string"],
  "transportTips": ["string"],
  "localFoodToTry": ["string"],
  "bookingSuggestion": "string"
}`;
}
