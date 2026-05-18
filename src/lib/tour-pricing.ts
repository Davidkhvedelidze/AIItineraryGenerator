import type { TourListItem, TourPricingTier } from "@/types/sanity-tour";

function isPositivePrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function formatPrice(price: number, currency?: string) {
  const currencyCode = currency || "USD";

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: Number.isInteger(price) ? 0 : 2,
    }).format(price);
  } catch {
    const formattedPrice = Number.isInteger(price) ? price.toString() : price.toFixed(2);
    return `${currencyCode} ${formattedPrice}`;
  }
}

function getLowestTier(tiers?: TourPricingTier[]) {
  const pricedTiers = tiers?.filter((tier) => isPositivePrice(tier.price)) ?? [];
  const adultTiers = pricedTiers.filter((tier) =>
    tier.label?.toLowerCase().includes("adult"),
  );
  const candidates = adultTiers.length > 0 ? adultTiers : pricedTiers;

  return candidates.reduce<TourPricingTier | null>((lowest, tier) => {
    if (!lowest || (tier.price ?? 0) < (lowest.price ?? 0)) {
      return tier;
    }

    return lowest;
  }, null);
}

export function getTourPriceSummary(tour: Pick<TourListItem, "priceFrom" | "currency" | "pricingTiers" | "priceNote">) {
  if (isPositivePrice(tour.priceFrom)) {
    return {
      label: "Price from",
      value: formatPrice(tour.priceFrom, tour.currency),
      helperText: tour.priceNote,
    };
  }

  const lowestTier = getLowestTier(tour.pricingTiers);

  if (lowestTier?.price) {
    return {
      label: "Price from",
      value: formatPrice(lowestTier.price, lowestTier.currency || tour.currency),
      helperText: tour.priceNote || lowestTier.note || lowestTier.label,
    };
  }

  if (tour.priceNote) {
    return {
      label: "Pricing",
      value: "Custom quote",
      helperText: tour.priceNote,
    };
  }

  return null;
}
