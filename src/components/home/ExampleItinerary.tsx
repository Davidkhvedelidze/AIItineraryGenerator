import { Clock, MapPin, Utensils } from "lucide-react";

const itineraryDays = [
  {
    day: "Day 1",
    title: "Tbilisi arrival and Old Town",
    route: "Airport transfer, Narikala, sulfur baths, dinner in Sololaki",
    note: "Easy first day after arrival",
  },
  {
    day: "Day 2",
    title: "Mtskheta and Kakheti wine country",
    route: "Jvari, Svetitskhoveli, Sighnaghi viewpoints, family wine cellar",
    note: "Balanced culture and wine route",
  },
  {
    day: "Day 3",
    title: "Kazbegi mountain road",
    route: "Zhinvali, Ananuri, Gudauri viewpoint, Gergeti Trinity Church",
    note: "Weather-aware mountain timing",
  },
  {
    day: "Day 4",
    title: "Food, markets, and flexible booking help",
    route: "Dry Bridge Market, Georgian cooking stop, optional local guide",
    note: "Good buffer before departure",
  },
];

export function ExampleItinerary() {
  return (
    <section className="bg-white/55 py-16">
      <div className="container grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Preview
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            See the kind of route the planner creates
          </h2>
          <p className="text-muted-foreground">
            The itinerary is designed for real travel days in Georgia, with
            pacing, overnight logic, food ideas, and practical notes included.
          </p>
          <div className="grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              Day-by-day timing
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              Route-aware suggestions
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Utensils className="h-4 w-4 text-primary" aria-hidden="true" />
              Local food stops
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          {itineraryDays.map((item) => (
            <article
              key={item.day}
              className="grid gap-3 border-b p-5 last:border-b-0 sm:grid-cols-[86px_1fr]"
            >
              <div className="text-sm font-semibold text-primary">
                {item.day}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.route}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-emerald-700">
                  {item.note}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
