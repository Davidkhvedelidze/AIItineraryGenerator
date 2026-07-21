import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { DownloadPdfButton } from "@/components/itinerary/DownloadPdfButton";
import { ShareButton } from "@/components/itinerary/ShareButton";
import { getPrimaryRegionImage } from "@/lib/itinerary/regionImages";
import type { ItineraryDay, ItineraryResult, TripFormData } from "@/types/trip";

const heroButtonClass =
  "border-white/45 bg-white/12 text-white backdrop-blur hover:bg-white/20 hover:text-white";

function formatLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildSubtitle(formData: TripFormData): string {
  return [
    `${formatLabel(formData.travelStyle)} pace`,
    `${formData.travelers} traveler${formData.travelers === 1 ? "" : "s"}`,
    `${formatLabel(formData.budget)} budget`,
  ].join(" · ");
}

type ItineraryHeroProps = {
  result: ItineraryResult;
  formData: TripFormData;
  days: ItineraryDay[];
  pageUrl: string;
};

export function ItineraryHero({ result, formData, days, pageUrl }: ItineraryHeroProps) {
  const heroImage = getPrimaryRegionImage(days);

  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      <div className="container relative flex min-h-[420px] flex-col justify-end gap-5 py-10 sm:min-h-[480px] sm:py-12 lg:min-h-[560px] lg:py-16">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100 backdrop-blur">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          Your Georgia Journey
        </span>

        <h1 className="max-w-3xl font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
          My {formData.days}-Day Georgia Journey
        </h1>

        {result.tripTitle?.trim() ? (
          <p className="max-w-xl font-[family-name:var(--font-fraunces)] text-lg italic text-amber-100 sm:text-xl">
            {result.tripTitle.trim()}
          </p>
        ) : null}

        <p className="max-w-xl text-sm font-medium text-amber-50/90 sm:text-base">
          {buildSubtitle(formData)}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <DownloadPdfButton result={result} className={heroButtonClass} />
          <ShareButton url={pageUrl} className={heroButtonClass} />
        </div>
      </div>
    </section>
  );
}
