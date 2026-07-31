import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getAccommodationAffiliateLink } from "@/lib/affiliate-config";
import { matchToursForDayRegion } from "@/lib/itinerary/matchTours";
import { getTourPriceSummary } from "@/lib/tour-pricing";
import type { TourListItem } from "@/types/sanity-tour";
import { getSanityImageUrl } from "@/lib/sanity/image";
import bookingLogo from "../../../public/bookingLogo.svg";
import bookingText from "../../../public/bookingText.png";

type DayRecommendationsProps = {
  dayRegion: string;
  /** The city the night is spent in, e.g. from the AI's per-day overnightStay field. Falls back to dayRegion when absent (older itineraries). */
  accommodationCity?: string;
  tours: TourListItem[];
  dayNumber?: number;
  tripStartDateTime?: string;
  adults?: number;
  /** False on the 2nd+ night of a multi-night stay in the same city — the offer only shows once, on the first night. */
  showAccommodation?: boolean;
  /** Full length of the stay in nights, so checkout covers every night, not just this one. */
  nights?: number;
};

function OwnTourCard({ tour }: { tour: TourListItem; dayRegion: string }) {
  const price = getTourPriceSummary(tour);

  const tourImage = getSanityImageUrl(tour.mainImage, {
    width: 400,
    height: 300,
    fit: "crop",
  });
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex items-center gap-2 lg:gap-4 lg:w-auto overflow-hidden rounded-2xl border border-primary/30 bg-primary-soft/60 p-1 lg:p-3 transition hover:border-primary/50 hover:bg-primary-soft w-full"
    >
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
        <Image
          src={tourImage ?? ""}
          alt={tour?.slug}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-amber-800">
          Recommended experience
        </p>
        <p className="mt-0.5 md:truncate font-serif text-[14px] lg:text-lg flex-wrap w-full font-semibold text-foreground">
          {tour.title}
        </p>
        {price ? (
          <p className="mt-0.5  text-[12px] lg:text-sm font-semibold text-amber-800">
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
  dayRegion: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener"
      className="group flex items-center gap-2 lg:gap-4 w-full lg:w-auto overflow-hidden rounded-2xl border border-stone-200 bg-white/70 p-1 lg:p-3 transition hover:border-stone-300 hover:bg-white"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
        <Image
          src={bookingLogo}
          alt={"booking logo for affiliate link"}
          fill
          sizes="92px"
          className="object-cover grayscale-[15%] transition group-hover:grayscale-0"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className=" text-[10px] lg:text-[12px] font-semibold uppercase tracking-[0.1em] text-stone-500">
          Where to stay
        </p>
        <p className="mt-0.5 md:truncate font-serif text-[14px] lg:text-lg font-semibold text-foreground">
          Recommendations in {location}
        </p>
        <div className="mt-0.5  text-[12px] lg:text-sm text-muted-foreground flex items-center">
          Search hotels on
          <div className="relative   shrink-0 overflow-hidden  h-5 w-[100px]">
            <Image
              src={bookingText}
              alt={"booking text for affiliate link"}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <ArrowUpRight
        className="h-5 w-5 shrink-0 text-stone-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-stone-700"
        aria-hidden="true"
      />
    </a>
  );
}

/** Our own tours always take visual priority over affiliate links: tour card first, accommodation line second. */
export function DayRecommendations({
  dayRegion,
  accommodationCity,
  tours,
  dayNumber,
  tripStartDateTime,
  adults,
  showAccommodation = true,
  nights,
}: DayRecommendationsProps) {
  const matchedTours = matchToursForDayRegion(dayRegion, tours);
  const accommodation = showAccommodation
    ? getAccommodationAffiliateLink(accommodationCity || dayRegion, {
        dayNumber,
        tripStartDateTime,
        adults,
        nights,
      })
    : null;

  if (matchedTours.length === 0 && !accommodation) return null;

  return (
    <div className="space-y-3 pt-1 md:pt-4 flex flex-col lg:flex-row  w-full ">
      {matchedTours?.slice(0, 1).map((tour) => (
        <OwnTourCard key={tour.slug} tour={tour} dayRegion={dayRegion} />
      ))}
      {accommodation ? (
        <AccommodationBlock
          location={accommodation.location}
          url={accommodation.url}
          dayRegion={dayRegion}
        />
      ) : null}
    </div>
  );
}
