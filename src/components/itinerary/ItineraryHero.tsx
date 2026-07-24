import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { DownloadPdfButton } from "@/components/itinerary/DownloadPdfButton";
import { ShareButton } from "@/components/itinerary/ShareButton";
import type { ItineraryResult } from "@/types/trip";
import cover from "./../../../public/tbilisiHD.jpg";

const heroButtonClass =
  "border-white/45 bg-white/12 text-white backdrop-blur hover:bg-white/20 hover:text-white";

type ItineraryHeroProps = {
  result: ItineraryResult;
  tripLength: number;
  pageUrl: string;
  badgeLabel?: string;
  heading?: string;
};

export function ItineraryHero({
  result,
  tripLength,
  pageUrl,
  badgeLabel = "Your Journey in Georgia",
  heading,
}: ItineraryHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <Image
        src={cover}
        alt={"georgia,tbilisi,travel,trip,adventure"}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      <div className="container relative flex min-h-[420px] flex-col justify-end gap-5 py-10 sm:min-h-[480px] sm:py-12 lg:min-h-[560px] lg:py-16">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100 backdrop-blur">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {badgeLabel}
        </span>

        <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {heading || `My ${tripLength}-Day Georgia Journey`}
        </h1>

        {result.tripTitle?.trim() ? (
          <p className="max-w-xl font-serif text-lg italic leading-[1.3] text-amber-100 sm:text-xl">
            {result.tripTitle.trim()}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <DownloadPdfButton result={result} className={heroButtonClass} />
          <ShareButton url={pageUrl} className={heroButtonClass} />
        </div>
      </div>
    </section>
  );
}
