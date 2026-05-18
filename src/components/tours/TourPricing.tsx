import { Info, Tags } from "lucide-react";
import { getTourPriceSummary } from "@/lib/tour-pricing";
import type { Tour, TourPricingTier } from "@/types/sanity-tour";

type TourPricingProps = {
  tour: Tour;
};

function formatTierPrice(tier: TourPricingTier, fallbackCurrency?: string) {
  if (typeof tier.price !== "number" || !Number.isFinite(tier.price)) {
    return "On request";
  }

  const currency = tier.currency || fallbackCurrency || "USD";

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: Number.isInteger(tier.price) ? 0 : 2,
    }).format(tier.price);
  } catch {
    const price = Number.isInteger(tier.price) ? tier.price.toString() : tier.price.toFixed(2);
    return `${currency} ${price}`;
  }
}

export function TourPricing({ tour }: TourPricingProps) {
  const price = getTourPriceSummary(tour);
  const tiers =
    tour.pricingTiers?.filter(
      (tier) => tier.label || typeof tier.price === "number" || tier.note,
    ) ?? [];

  if (!price && tiers.length === 0) return null;

  return (
    <section id="pricing" className="scroll-mt-24 space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Pricing
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Clear private tour pricing
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {price ? (
          <div className="grid gap-5 border-b bg-secondary p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {price.label}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{price.value}</p>
              {price.helperText ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {price.helperText}
                </p>
              ) : null}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-primary/25">
              <Tags className="h-4 w-4" aria-hidden="true" />
              Group-size pricing
            </div>
          </div>
        ) : null}

        {tiers.length > 0 ? (
          <div className="divide-y">
            {tiers.map((tier, index) => (
              <div
                key={`${tier.label || "tier"}-${tier.price ?? "request"}-${index}`}
                className="grid gap-3 p-5 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
              >
                <div>
                  <p className="font-semibold text-foreground">{tier.label || "Traveler"}</p>
                  {tier.note ? (
                    <p className="mt-1 leading-6 text-muted-foreground">{tier.note}</p>
                  ) : null}
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatTierPrice(tier, tour.currency)}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex gap-2 border-t bg-muted/60 px-5 py-4 text-xs leading-5 text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
          <p>
            Prices can depend on private group size, traveler age group, selected
            pickup, and route adjustments before confirmation.
          </p>
        </div>
      </div>
    </section>
  );
}
