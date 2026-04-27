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

export type TripFormData = {
  days: number;
  month: string;
  startingCity: "Tbilisi" | "Kutaisi" | "Batumi";
  interests: TripInterest[];
  budget: "low" | "medium" | "premium";
  travelStyle: "relaxed" | "balanced" | "active";
  travelers: number;
  language: "English" | "Georgian";
  email?: string;
};

export type ItineraryDay = {
  day: number;
  title: string;
  region: string;
  morning: string;
  afternoon: string;
  evening: string;
  foodSuggestion: string;
  travelTip: string;
};

export type ItineraryResult = {
  tripTitle: string;
  overview: string;
  days: ItineraryDay[];
  estimatedBudget: string;
  bestFor: string[];
  packingTips: string[];
  transportTips: string[];
  localFoodToTry: string[];
  bookingSuggestion: string;
};

export type GenerateItineraryResponse =
  | {
      success: true;
      data: ItineraryResult;
    }
  | {
      success: false;
      message: string;
    };
