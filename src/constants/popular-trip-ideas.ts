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
  faq?: {
    question: string;
    answer: string;
  }[];
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
    faq: [
      {
        question: "Is 3 days enough for a first trip to Georgia?",
        answer:
          "Three days is enough for a compact introduction if you base yourself in Tbilisi and choose one realistic day trip. You will not see every region, but you can cover old town highlights, Mtskheta, and either a mountain or wine-country route.",
      },
      {
        question: "Where should I stay for a 3-day Georgia itinerary?",
        answer:
          "Tbilisi is the most practical base for a short trip because airport transfers, restaurants, walking routes, and day trips are easy to organize from one hotel.",
      },
      {
        question: "Should I choose Kazbegi or Kakheti for the day trip?",
        answer:
          "Choose Kazbegi for dramatic mountain scenery and viewpoints, especially in clear weather. Choose Kakheti if you prefer wine, food, smaller towns, and a gentler driving day.",
      },
      {
        question: "Do I need a private driver for this route?",
        answer:
          "A private driver is not required inside Tbilisi, but it can save time on the Mtskheta and day-trip portions. For only three days, avoiding transport delays usually makes the trip feel less rushed.",
      },
    ],
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
    faq: [
      {
        question: "Is 5 days enough for Tbilisi, Kazbegi, and Kakheti?",
        answer:
          "Five days works well if you keep the route focused and avoid adding extra regions. Plan one overnight near Kazbegi and one full day for Kakheti so the itinerary does not become a series of long transfers.",
      },
      {
        question: "Can I do Kazbegi as a day trip instead of overnighting?",
        answer:
          "Kazbegi can be visited as a long day trip from Tbilisi, but an overnight stay gives you better light, more flexibility for Gergeti Trinity Church, and a less tiring mountain route.",
      },
      {
        question: "How much driving is involved in this itinerary?",
        answer:
          "Expect several scenic driving days, especially on the Military Highway to Kazbegi and through Kakheti. Starting early helps you keep enough time for stops, meals, and short walks.",
      },
      {
        question: "Is this 5-day route good for couples?",
        answer:
          "Yes. The mix of Tbilisi restaurants, mountain views, wine tastings, and small-town walks makes it a strong route for couples who want variety without changing hotels every night.",
      },
    ],
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
    faq: [
      {
        question: "What is the best way to spend 7 days in Georgia?",
        answer:
          "A balanced week usually combines Tbilisi, one wine-country day, Kazbegi or another mountain area, and western Georgia around Kutaisi. This gives you city culture, food, nature, and heritage without overloading the schedule.",
      },
      {
        question: "Should this itinerary end in Kutaisi or Tbilisi?",
        answer:
          "End in Kutaisi if your flight leaves from Kutaisi International Airport or you want to continue toward Batumi. Return to Tbilisi if you prefer simpler logistics or have a round-trip flight from Tbilisi.",
      },
      {
        question: "Can I add Batumi to a 7-day Georgia trip?",
        answer:
          "Batumi can be added, but it usually means removing or shortening another region. It is best as an extension if you have extra days or if the Black Sea coast is a priority.",
      },
      {
        question: "Is this one-week route suitable for first-time visitors?",
        answer:
          "Yes. It covers Georgia's most familiar highlights while keeping the pacing realistic. First-time visitors should keep one flexible block for weather, road timing, or a slower city day.",
      },
    ],
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
    faq: [
      {
        question: "Is Georgia a good destination for a family trip?",
        answer:
          "Georgia can work very well for families when the route uses shorter drives, central hotels, and flexible outdoor stops. Tbilisi, Mtskheta, Kakheti, and accessible mountain viewpoints are practical choices.",
      },
      {
        question: "How should families plan transport in Georgia?",
        answer:
          "For families, a private transfer or driver is often more comfortable than mixing many shared marshrutkas. It gives you space for luggage, breaks, and last-minute schedule changes.",
      },
      {
        question: "What activities are good for kids in Georgia?",
        answer:
          "Easy cable car rides, old town walks, food workshops, farm lunches, short nature trails, and scenic viewpoints usually work better than long museum-heavy days.",
      },
      {
        question: "How many days should a family spend in Georgia?",
        answer:
          "Five to seven days is a comfortable first family trip. It gives enough time for Tbilisi and nearby regions while leaving room for rest, slower meals, and weather changes.",
      },
    ],
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
    faq: [
      {
        question: "Can Kakheti be visited as a day trip from Tbilisi?",
        answer:
          "Yes, Kakheti is one of the best day trips from Tbilisi for wine and food. An overnight stay is better if you want a slower pace, more tastings, or time in both Sighnaghi and Telavi.",
      },
      {
        question: "When is the best time for a Kakheti wine tour?",
        answer:
          "September and October are especially popular because of the grape harvest and warm weather. Spring and early summer are also pleasant for vineyard views and outdoor meals.",
      },
      {
        question: "Do Kakheti wineries require reservations?",
        answer:
          "Many small family wineries prefer reservations, especially for qvevri tastings and meals. Booking ahead helps you avoid closed cellars or rushed tastings.",
      },
      {
        question: "Should I rent a car for a wine tour?",
        answer:
          "It is better to use a driver or organized transfer if you plan to taste wine. Roads are manageable, but driving after tastings is not a good idea.",
      },
    ],
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
    faq: [
      {
        question: "Is the road to Kazbegi open in winter?",
        answer:
          "The road often operates in winter, but closures can happen because of snow, avalanche risk, or heavy traffic. Check conditions before departure and keep the schedule flexible.",
      },
      {
        question: "Do I need a 4x4 for Gudauri and Kazbegi in winter?",
        answer:
          "A suitable winter vehicle, experienced driver, and proper tires matter more than the label alone. For snowy conditions, chains or a 4x4 may be required on parts of the route.",
      },
      {
        question: "Can non-skiers enjoy Gudauri in winter?",
        answer:
          "Yes. Gudauri can still be worthwhile for snow views, cable cars, short walks, restaurants, and scenic stops, even if you do not plan to ski.",
      },
      {
        question: "How many days should I plan for a winter mountain trip?",
        answer:
          "Two days is enough for a quick Gudauri escape, while three or four days gives you a better chance of reaching Kazbegi in good weather and enjoying the route without rushing.",
      },
    ],
  },
];
