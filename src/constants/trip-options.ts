import type { TripFormData, TripInterest } from "@/types/trip";

interface Option<T extends string> {
  label: string;
  value: T;
  icon?: string;
  description?: string;
}

export const interestOptions: Option<TripInterest>[] = [
  { label: "Mountains", value: "mountains", icon: "Mountain" },
  { label: "Wine", value: "wine", icon: "Wine" },
  { label: "Food", value: "food", icon: "Utensils" },
  { label: "History", value: "history", icon: "Landmark" },
  { label: "Culture", value: "culture", icon: "Theater" },
  { label: "Hiking", value: "hiking", icon: "Footprints" },
  { label: "Sea", value: "sea", icon: "Waves" },
  { label: "Nightlife", value: "nightlife", icon: "MoonStar" },
  { label: "Family Friendly", value: "family-friendly", icon: "Users" },
  { label: "Photography", value: "photography", icon: "Camera" }
];

export const budgetOptions: Option<TripFormData["budget"]>[] = [
  { label: "Low", value: "low", description: "Budget-conscious and practical." },
  { label: "Medium", value: "medium", description: "Comfort with great value." },
  { label: "Premium", value: "premium", description: "Higher comfort and curated experiences." }
];

export const travelStyleOptions: Option<TripFormData["travelStyle"]>[] = [
  { label: "Relaxed", value: "relaxed", description: "Slow pace with more downtime." },
  { label: "Balanced", value: "balanced", description: "Mix of highlights and free time." },
  { label: "Active", value: "active", description: "Packed days for explorers." }
];

export const startingCityOptions: Option<TripFormData["startingCity"]>[] = [
  { label: "Tbilisi", value: "Tbilisi" },
  { label: "Kutaisi", value: "Kutaisi" },
  { label: "Batumi", value: "Batumi" }
];

export const languageOptions: Option<TripFormData["language"]>[] = [
  { label: "English", value: "English" },
  { label: "Georgian", value: "Georgian" }
];
