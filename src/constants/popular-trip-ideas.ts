export interface PopularTripIdea {
  title: string;
  slug: string;
  description: string;
  duration: string;
  bestFor: string[];
  regions: string[];
}

export const popularTripIdeas: PopularTripIdea[] = [
  {
    title: "3 Days in Georgia",
    slug: "3-days-in-georgia",
    description:
      "A short but realistic first-time Georgia route covering Tbilisi, Mtskheta, and a scenic day trip.",
    duration: "3 days",
    bestFor: ["First-time visitors", "Weekend trip"],
    regions: ["Tbilisi", "Mtskheta"],
  },
  {
    title: "5 Days: Tbilisi + Kazbegi + Kakheti",
    slug: "5-days-tbilisi-kazbegi-kakheti",
    description:
      "A balanced itinerary with culture, mountains, wine, and local food across Georgia’s most popular regions.",
    duration: "5 days",
    bestFor: ["Couples", "Culture", "Mountains", "Wine"],
    regions: ["Tbilisi", "Kazbegi", "Kakheti"],
  },
  {
    title: "7 Days Georgia Highlights",
    slug: "7-days-georgia-highlights",
    description:
      "A classic one-week Georgia route combining Tbilisi, Kakheti, Kazbegi, Kutaisi, caves, and optional Batumi.",
    duration: "7 days",
    bestFor: ["First-time visitors", "Families", "Highlights"],
    regions: ["Tbilisi", "Kakheti", "Kazbegi", "Kutaisi"],
  },
  {
    title: "Family Trip in Georgia",
    slug: "family-trip-in-georgia",
    description:
      "A comfortable family-friendly route with realistic driving distances, easy activities, nature, and culture.",
    duration: "5–7 days",
    bestFor: ["Families", "Kids", "Relaxed pace"],
    regions: ["Tbilisi", "Mtskheta", "Kakheti", "Kazbegi"],
  },
  {
    title: "Wine Tour in Kakheti",
    slug: "wine-tour-in-kakheti",
    description:
      "A wine-focused route through Kakheti with vineyards, traditional food, scenic towns, and cultural stops.",
    duration: "1–2 days",
    bestFor: ["Wine lovers", "Food", "Couples"],
    regions: ["Kakheti", "Sighnaghi", "Telavi"],
  },
  {
    title: "Winter Trip to Gudauri and Kazbegi",
    slug: "winter-trip-gudauri-kazbegi",
    description:
      "A winter mountain route with snowy landscapes, Gudauri viewpoints, Kazbegi, and cozy local experiences.",
    duration: "2–4 days",
    bestFor: ["Winter travel", "Snow", "Mountains"],
    regions: ["Gudauri", "Kazbegi"],
  },
];
