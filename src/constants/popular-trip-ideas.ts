export interface TripItineraryDay {
  day: string;
  title: string;
  details: string;
}

export interface PopularTripIdea {
  title: string;
  slug: string;
  description: string;
  duration: string;
  bestFor: string[];
  regions: string[];
  metaTitle: string;
  metaDescription: string;
  highlights: string[];
  itinerary: TripItineraryDay[];
  travelTips: string[];
  bestTimeToVisit: string;
  startingPoint: string;
  endingPoint: string;
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
    metaTitle: "3 Days in Georgia Itinerary: Tbilisi, Mtskheta & Day Trip",
    metaDescription:
      "Plan a realistic 3-day Georgia itinerary with Tbilisi old town, Mtskheta heritage sites, and a scenic day trip for first-time visitors.",
    highlights: ["Old Tbilisi walking tour", "Jvari Monastery views", "Sulfur bath district"],
    itinerary: [
      { day: "Day 1", title: "Tbilisi Old Town", details: "Explore Metekhi, Abanotubani, Narikala, and evening food spots." },
      { day: "Day 2", title: "Mtskheta and Chronicles", details: "Visit Svetitskhoveli, Jvari, and return for sunset in Tbilisi." },
      { day: "Day 3", title: "Scenic day trip", details: "Choose Kazbegi viewpoints or Kakheti wineries based on weather." },
    ],
    travelTips: ["Start early for day trips.", "Carry cash for small village shops.", "Wear layers in spring/autumn."],
    bestTimeToVisit: "April to June and September to October",
    startingPoint: "Tbilisi",
    endingPoint: "Tbilisi",
  },
  {
    title: "5 Days: Tbilisi + Kazbegi + Kakheti",
    slug: "5-days-tbilisi-kazbegi-kakheti",
    description:
      "A balanced itinerary with culture, mountains, wine, and local food across Georgia’s most popular regions.",
    duration: "5 days",
    bestFor: ["Couples", "Culture", "Mountains", "Wine"],
    regions: ["Tbilisi", "Kazbegi", "Kakheti"],
    metaTitle: "5-Day Georgia Trip: Tbilisi, Kazbegi, and Kakheti Wine Region",
    metaDescription:
      "Discover a balanced 5-day Georgia route across Tbilisi, Kazbegi mountain landscapes, and Kakheti wineries with practical travel tips.",
    highlights: ["Gergeti Trinity Church", "Signagi old town", "Tbilisi culinary experiences"],
    itinerary: [
      { day: "Day 1", title: "Arrive in Tbilisi", details: "Settle in, explore Rustaveli and old town viewpoints." },
      { day: "Day 2", title: "Drive to Kazbegi", details: "Stop at Ananuri and Gudauri panorama before overnight in Stepantsminda." },
      { day: "Day 3", title: "Kazbegi to Tbilisi", details: "Morning hikes and return to Tbilisi for relaxed evening." },
      { day: "Day 4", title: "Kakheti wine route", details: "Visit Telavi and family wineries with traditional lunch." },
      { day: "Day 5", title: "Signagi and departure", details: "Walk the city walls and transfer back to Tbilisi." },
    ],
    travelTips: ["Roads to Kazbegi can close in winter.", "Book winery tastings in advance.", "Private driver saves time."],
    bestTimeToVisit: "May to October",
    startingPoint: "Tbilisi",
    endingPoint: "Tbilisi",
  },
  {
    title: "7 Days Georgia Highlights",
    slug: "7-days-georgia-highlights",
    description:
      "A classic one-week Georgia route combining Tbilisi, Kakheti, Kazbegi, Kutaisi, caves, and optional Batumi.",
    duration: "7 days",
    bestFor: ["First-time visitors", "Families", "Highlights"],
    regions: ["Tbilisi", "Kakheti", "Kazbegi", "Kutaisi"],
    metaTitle: "7-Day Georgia Highlights Itinerary for First-Time Visitors",
    metaDescription:
      "See Georgia’s top highlights in one week: Tbilisi, Kakheti, Kazbegi, Kutaisi caves, and optional Batumi extension with practical pacing.",
    highlights: ["Prometheus Cave", "Kazbegi mountain pass", "Kakheti winery villages"],
    itinerary: [
      { day: "Day 1", title: "Tbilisi introduction", details: "Historic center walk and local dining." },
      { day: "Day 2", title: "Kakheti day trip", details: "Wine country and Signagi viewpoints." },
      { day: "Day 3", title: "Kazbegi road", details: "Ananuri, Gudauri, and overnight near Gergeti." },
      { day: "Day 4", title: "Return to Tbilisi", details: "Flexible stops and city rest." },
      { day: "Day 5", title: "Transfer to Kutaisi", details: "Explore Bagrati and central district." },
      { day: "Day 6", title: "Caves and canyons", details: "Prometheus Cave and Martvili canyon activities." },
      { day: "Day 7", title: "Departure or Batumi add-on", details: "Depart Kutaisi or continue to Black Sea coast." },
    ],
    travelTips: ["Keep one flexible buffer day.", "Mix private and shared transfers.", "Prebook cave tickets in peak season."],
    bestTimeToVisit: "May to June and September",
    startingPoint: "Tbilisi",
    endingPoint: "Kutaisi or Tbilisi",
  },
  {
    title: "Family Trip in Georgia",
    slug: "family-trip-in-georgia",
    description:
      "A comfortable family-friendly route with realistic driving distances, easy activities, nature, and culture.",
    duration: "5–7 days",
    bestFor: ["Families", "Kids", "Relaxed pace"],
    regions: ["Tbilisi", "Mtskheta", "Kakheti", "Kazbegi"],
    metaTitle: "Family Trip in Georgia: 5–7 Day Kid-Friendly Itinerary",
    metaDescription:
      "Use this family-friendly Georgia itinerary with manageable drives, outdoor stops, and cultural activities suited for kids and parents.",
    highlights: ["Easy city walking routes", "Nature viewpoints", "Hands-on food experiences"],
    itinerary: [
      { day: "Day 1", title: "Arrive in Tbilisi", details: "Light walking and funicular for easy city views." },
      { day: "Day 2", title: "Mtskheta half-day", details: "Short transfer and historic landmarks with open spaces." },
      { day: "Day 3", title: "Kakheti soft adventure", details: "Farm lunch and short scenic walks." },
      { day: "Day 4", title: "Transfer and rest", details: "Flexible travel day with playground stops." },
      { day: "Day 5", title: "Kazbegi viewpoints", details: "Cable car or easy access mountain panoramas." },
    ],
    travelTips: ["Plan shorter driving blocks.", "Choose hotels with family rooms.", "Pack snacks for mountain routes."],
    bestTimeToVisit: "June to September",
    startingPoint: "Tbilisi",
    endingPoint: "Tbilisi",
  },
  {
    title: "Wine Tour in Kakheti",
    slug: "wine-tour-in-kakheti",
    description:
      "A wine-focused route through Kakheti with vineyards, traditional food, scenic towns, and cultural stops.",
    duration: "1–2 days",
    bestFor: ["Wine lovers", "Food", "Couples"],
    regions: ["Kakheti", "Sighnaghi", "Telavi"],
    metaTitle: "Kakheti Wine Tour Itinerary: Sighnaghi, Telavi & Vineyards",
    metaDescription:
      "Explore a focused Kakheti wine tour with top cellar visits, traditional qvevri wines, local cuisine, and easy transport planning from Tbilisi.",
    highlights: ["Qvevri winery tastings", "Sighnaghi city walls", "Local food pairings"],
    itinerary: [
      { day: "Day 1", title: "Tbilisi to Sighnaghi", details: "Visit Bodbe Monastery and evening tastings." },
      { day: "Day 2", title: "Telavi cellars", details: "Family wineries and return to Tbilisi." },
    ],
    travelTips: ["Avoid self-driving after tastings.", "Check harvest season events.", "Reserve boutique wineries ahead."],
    bestTimeToVisit: "September to October",
    startingPoint: "Tbilisi",
    endingPoint: "Tbilisi",
  },
  {
    title: "Winter Trip to Gudauri and Kazbegi",
    slug: "winter-trip-gudauri-kazbegi",
    description:
      "A winter mountain route with snowy landscapes, Gudauri viewpoints, Kazbegi, and cozy local experiences.",
    duration: "2–4 days",
    bestFor: ["Winter travel", "Snow", "Mountains"],
    regions: ["Gudauri", "Kazbegi"],
    metaTitle: "Winter Georgia Trip: Gudauri and Kazbegi Snow Itinerary",
    metaDescription:
      "Plan a winter Georgia itinerary through Gudauri and Kazbegi with snow-safe timing, mountain highlights, and transport tips for cold weather.",
    highlights: ["Gudauri ski slopes", "Snowy Gergeti views", "Mountain guesthouse stays"],
    itinerary: [
      { day: "Day 1", title: "Drive to Gudauri", details: "Reach ski area and enjoy evening mountain views." },
      { day: "Day 2", title: "Gudauri activities", details: "Skiing, snowmobiling, or scenic viewpoints." },
      { day: "Day 3", title: "Kazbegi transfer", details: "Weather permitting, continue to Stepantsminda and Gergeti." },
      { day: "Day 4", title: "Return to Tbilisi", details: "Early departure with road condition checks." },
    ],
    travelTips: ["Monitor military road updates daily.", "Use winter tires/chains.", "Start drives early due to weather."],
    bestTimeToVisit: "December to March",
    startingPoint: "Tbilisi",
    endingPoint: "Tbilisi",
  },
];
