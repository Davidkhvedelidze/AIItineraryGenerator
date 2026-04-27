import type { GeorgianAirport, PreferredCity, TripFormData, TripInterest } from "@/types/trip";

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

export const airportOptions: Option<GeorgianAirport>[] = [
  { label: "Tbilisi International Airport", value: "Tbilisi International Airport" },
  { label: "Kutaisi International Airport", value: "Kutaisi International Airport" },
  { label: "Batumi International Airport", value: "Batumi International Airport" }
];

export const preferredCityOptions: Option<PreferredCity>[] = [
  { label: "Tbilisi", value: "Tbilisi", description: "Capital city, food, culture, nightlife." },
  { label: "Batumi", value: "Batumi", description: "Black Sea, boulevard, modern city breaks." },
  { label: "Kutaisi", value: "Kutaisi", description: "Canyons, caves, west Georgia base." },
  { label: "Sighnaghi", value: "Sighnaghi", description: "Kakheti wine region and old town views." },
  { label: "Telavi", value: "Telavi", description: "Wine estates and Kakheti day trips." },
  { label: "Mtskheta", value: "Mtskheta", description: "Historic churches near Tbilisi." },
  { label: "Stepantsminda", value: "Stepantsminda", description: "Kazbegi mountains and alpine scenery." },
  { label: "Borjomi", value: "Borjomi", description: "Nature, mineral waters, central Georgia." },
  { label: "Bakuriani", value: "Bakuriani", description: "Mountain resort and family stays." },
  { label: "Mestia", value: "Mestia", description: "Svaneti towers, hiking, mountain views." },
  { label: "Zugdidi", value: "Zugdidi", description: "Samegrelo base and route to Svaneti." },
  { label: "Ureki", value: "Ureki", description: "Beach town with magnetic sands." },
  { label: "Kobuleti", value: "Kobuleti", description: "Coastal stays near Batumi." },
  { label: "Akhaltsikhe", value: "Akhaltsikhe", description: "Rabati Castle and south Georgia routes." },
  { label: "Ambrolauri", value: "Ambrolauri", description: "Racha wine, mountains, quiet nature." }
];

export const languageOptions: Option<TripFormData["language"]>[] = [
  { label: "English", value: "English" },
  { label: "Georgian", value: "Georgian" }
];
