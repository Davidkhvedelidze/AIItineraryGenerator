import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SeoCTAProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function SeoCTA({
  title = "Want a custom Georgia itinerary?",
  description = "Use TripMate Georgia to generate a realistic day-by-day route based on your travel dates, budget, interests, and group size.",
  primaryLabel = "Generate Custom Itinerary",
  primaryHref = "/#trip-planner",
  secondaryLabel = "Explore Trip Ideas",
  secondaryHref = "/trip-ideas",
}: SeoCTAProps) {
  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={primaryHref} className={buttonVariants()}>
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
          )}
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
