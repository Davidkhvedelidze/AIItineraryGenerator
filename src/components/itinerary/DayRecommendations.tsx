import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BedDouble } from "lucide-react";
import { getAccommodationAffiliateLink } from "@/lib/affiliate-config";
import { matchToursForDayRegion } from "@/lib/itinerary/matchTours";
import { getRegionImage } from "@/lib/itinerary/regionImages";
import { getTourPriceSummary } from "@/lib/tour-pricing";
import type { TourListItem } from "@/types/sanity-tour";

type DayRecommendationsProps = {
  dayRegion: string;
  tours: TourListItem[];
};

function OwnTourCard({
  tour,
  dayRegion,
}: {
  tour: TourListItem;
  dayRegion: string;
}) {
  const price = getTourPriceSummary(tour);
  const image = getRegionImage(dayRegion);

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/30 bg-primary-soft/60 p-3 transition hover:border-primary/50 hover:bg-primary-soft"
    >
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-28">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-amber-800">
          Recommended experience
        </p>
        <p className="mt-0.5 truncate font-[family-name:var(--font-fraunces)] text-lg font-semibold text-foreground">
          {tour.title}
        </p>
        {price ? (
          <p className="mt-0.5 text-sm font-semibold text-amber-800">
            {price.label === "Price from" ? "From " : ""}
            {price.value}
          </p>
        ) : null}
      </div>
      <ArrowRight
        className="h-5 w-5 shrink-0 text-amber-700 transition group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

function AccommodationBlock({
  location,
  url,
}: {
  location: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener"
      className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
    >
      <BedDouble
        className="h-4 w-4 shrink-0 text-amber-700"
        aria-hidden="true"
      />
      <span>
        Where to stay in{" "}
        <span className="underline decoration-amber-700/40 underline-offset-2">
          {location}
        </span>
      </span>
    </a>
  );
}

/** Our own tours always take visual priority over affiliate links: tour card first, accommodation line second. */
export function DayRecommendations({
  dayRegion,
  tours,
}: DayRecommendationsProps) {
  const matchedTours = matchToursForDayRegion(dayRegion, tours);
  const accommodation = getAccommodationAffiliateLink(dayRegion);

  if (matchedTours.length === 0 && !accommodation) return null;

  return (
    <div className="space-y-3 pt-1 md:pt-4">
      {matchedTours.slice(0, 1).map((tour) => (
        <OwnTourCard key={tour.slug} tour={tour} dayRegion={dayRegion} />
      ))}
      {accommodation ? (
        <AccommodationBlock
          location={accommodation.location}
          url={accommodation.url}
        />
      ) : null}
    </div>
  );
}
