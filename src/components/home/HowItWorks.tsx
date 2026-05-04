import { ClipboardList, Route, Sparkles } from "lucide-react";

const steps = [
  {
    title: "Share your trip details",
    description:
      "Choose dates, airports, overnight cities, interests, pace, budget, and traveler count.",
    icon: ClipboardList,
  },
  {
    title: "Get a realistic AI route",
    description:
      "The planner builds a practical Georgia itinerary with food, transport, and pacing notes.",
    icon: Sparkles,
  },
  {
    title: "Use it or request help",
    description:
      "Download the plan, send it by email, or ask a local expert to help with booking.",
    icon: Route,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Process
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            From rough idea to usable Georgia trip plan
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <step.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
