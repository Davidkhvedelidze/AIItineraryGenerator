import { ClipboardList, Route, Sparkles } from "lucide-react";

const steps = [
  { title: "Share Your Preferences", description: "Choose trip length, city, interests, budget, and travel style.", icon: ClipboardList },
  { title: "AI Builds Your Route", description: "Our AI creates realistic day-by-day plans designed for Georgia.", icon: Sparkles },
  { title: "Review and Use", description: "Get your itinerary with food tips, transport notes, and next steps.", icon: Route }
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container space-y-8">
        <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.title} className="rounded-lg border bg-card p-6 shadow-sm">
              <step.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
