import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CustomizeTripCta({ className = "" }: { className?: string }) {
  return (
    <div className={`container ${className}`}>
      <Link
        href="/#trip-planner"
        className="group mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:justify-between sm:text-left"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-4 ring-amber-50">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Like this trip? Make it yours.
            </h3>
            <p className="text-sm text-muted-foreground">
              Build a free, personalized Georgia itinerary in minutes.
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-amber-700">
          Customize this trip
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
    </div>
  );
}
