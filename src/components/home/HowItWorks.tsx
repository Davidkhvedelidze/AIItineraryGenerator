import { ClipboardList, MessageCircle, Route, Sparkles } from "lucide-react";

const steps = [
  {
    kicker: "01",
    title: "Share the shape of the trip",
    description:
      "Dates, airports, group size, pace, family needs, interests, and the regions you want to include.",
    icon: ClipboardList,
  },
  {
    kicker: "02",
    title: "Receive a realistic Georgia route",
    description:
      "The planner builds day-by-day timing with road logic, food ideas, overnight cities, and seasonal notes.",
    icon: Route,
  },
  {
    kicker: "03",
    title: "Make it bookable with local help",
    description:
      "Refine pickup, private driver details, route comfort, and tour options before confirming the trip.",
    icon: MessageCircle,
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.76fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              How it works
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
              From first idea to a private trip you can trust
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            TripMate keeps the speed of AI, but frames every route around real
            Georgian roads, family comfort, seasonal changes, and local booking
            support.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/10"
              >
                <div className="absolute right-4 top-3 font-serif text-5xl font-semibold text-stone-300">
                  {step.kicker}
                </div>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-amber-900 text-amber-200">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="relative mt-5 text-lg font-semibold leading-7 text-foreground">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-sm leading-6 text-stone-600">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-amber-900 px-5 py-4 text-sm leading-6 text-amber-50 shadow-lg shadow-amber-950/10 sm:flex-row sm:items-center">
          <Sparkles
            className="h-5 w-5 shrink-0 text-amber-200"
            aria-hidden="true"
          />
          <span>
            The memorable promise: plan Georgia with AI, then make it real with
            local private tour support.
          </span>
        </div>
      </div>
    </section>
  );
}
