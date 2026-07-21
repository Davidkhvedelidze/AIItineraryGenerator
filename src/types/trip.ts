import type { ApiErrorCode } from "@/lib/api/apiError";
import type { ItineraryDay, ItineraryResult } from "@/lib/validations/itineraryResultSchema";

export type TripInterest =
  | "mountains"
  | "wine"
  | "food"
  | "history"
  | "culture"
  | "hiking"
  | "sea"
  | "nightlife"
  | "family-friendly"
  | "photography";

export type GeorgianAirport = "Tbilisi International Airport" | "Kutaisi International Airport" | "Batumi International Airport";

export type PreferredCity =
  | "Tbilisi"
  | "Batumi"
  | "Kutaisi"
  | "Sighnaghi"
  | "Telavi"
  | "Mtskheta"
  | "Stepantsminda"
  | "Borjomi"
  | "Bakuriani"
  | "Mestia"
  | "Zugdidi"
  | "Ureki"
  | "Kobuleti"
  | "Akhaltsikhe"
  | "Ambrolauri";

export type TourType = "private-guided" | "public-group" | "self-guided";

export type TripFormData = {
  days: number;
  /** [arrivalDateTime, departureDateTime] — index 0 is always the earlier date. */
  travelDates: [string, string];
  arrivalAirport: GeorgianAirport;
  departureAirport: GeorgianAirport;
  preferredCities: PreferredCity[];
  interests: TripInterest[];
  budget: "low" | "medium" | "premium";
  travelStyle: "relaxed" | "balanced" | "active";
  tourType: TourType;
  travelers: number;
  language: "English" | "Georgian";
  email: string;
  mobileNumber?: string;
  tourDescription?: string;
};

export type { ItineraryDay, ItineraryResult };

export type GenerateItineraryResponse =
  | {
      success: true;
      data: ItineraryResult;
      /** Short shareable ID for the persisted /itinerary/[id] page, or null if persistence failed. */
      shareId: string | null;
    }
  | {
      success: false;
      message: string;
      code?: ApiErrorCode;
    };
