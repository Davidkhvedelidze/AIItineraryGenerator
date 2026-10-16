import type { TripFormData } from "@/types/trip";

const tourTypeLabels: Record<TripFormData["tourType"], string> = {
  "private-guided": "Private guided tour",
  "public-group": "Public group tour",
  "self-guided": "Self-guided tour by the customer",
};

function buildTourTypeRules(formData: TripFormData): string {
  if (formData.tourType === "private-guided") {
    return `Private custom tour offer rules:
- Create a private Georgia tour itinerary for ${formData.travelers} guests from ${formData.travelDates[0].slice(0, 10)} to ${formData.travelDates[1].slice(0, 10)}.
- Write as the private guide and driver using your own car.
- Treat preferred overnight cities as must-include stays, not the only stays. Use the customer tour description as the overnight schedule when it specifies nights.
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

function buildTravelDateLines(formData: TripFormData): string {
  const [arrivalDateTime, departureDateTime] = formData.travelDates;

  // Placeholder times would otherwise be read as real flight times (e.g. "06:00Z" as a dawn arrival).
  if (formData.flightTimesUnknown) {
    return `- Arrival date: ${arrivalDateTime.slice(0, 10)} (flight time not provided: assume a midday arrival)
- Departure date: ${departureDateTime.slice(0, 10)} (flight time not provided: assume a mid-afternoon departure)`;
  }

  return `- Arrival date and time: ${arrivalDateTime}
- Departure date and time: ${departureDateTime}`;
}

// General itinerary rules live in ITINERARY_SYSTEM_PROMPT (src/lib/itinerary/system-prompt.ts);
// this prompt carries the request itself plus rules that only apply to it.
export function buildItineraryPrompt(formData: TripFormData): string {
  return `Create a personalized day-by-day travel itinerary based on the user's preferences.

User details:
- Trip length: ${formData.days} days
- Arrival airport: ${formData.arrivalAirport}
- Departure airport: ${formData.departureAirport}
${buildTravelDateLines(formData)}
- Preferred overnight cities: ${formData.preferredCities.join(", ")}
- Interests: ${formData.interests.join(", ")}
- Budget: ${formData.budget}
- Travel style: ${formData.travelStyle}
- Tour type: ${tourTypeLabels[formData.tourType]}
- Number of travelers: ${formData.travelers}
- Language: English
- Customer tour description: ${formData.tourDescription || "Not provided"}

${buildTourTypeRules(formData)}

Rules:
- If the trip is longer than 3 days and only one preferred overnight city is selected (e.g. only "Tbilisi"), that city is the home base, not the whole trip. Do not spend every day in it: the traveler wants varied experiences and the best use of their time. Besides the arrival and departure days, give the base city itself about 1-2 full days and use the rest for different regions and experiences — day trips from the base (from Tbilisi: Mtskheta, Kazbegi, Kakheti/Sighnaghi, Gori & Uplistsikhe), plus an overnight elsewhere when it saves a long return drive or the place deserves it. Follow the customer's tour description instead if it asks to stay in one city.
- Price every amount in US dollars (USD). totalPrice, pricePerPerson, and estimatedBudget must all be quoted in USD (e.g. "$450", "$220-$260"), never GEL, EUR, or any other currency — this must match the rest of the site, which prices exclusively in USD.

Return only valid JSON in exactly this shape:
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
      "travelTip": "string",
      "overnightStay": "string"
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
  "bookingSuggestion": "string",
  "overnightStayPlan": [{ "day": 1, "city": "string" }]
}`;
}
