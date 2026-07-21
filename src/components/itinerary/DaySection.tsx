import Image from "next/image";
import { Lightbulb, MapPin, Utensils } from "lucide-react";
import { DayRecommendations } from "@/components/itinerary/DayRecommendations";
import { getRegionImage } from "@/lib/itinerary/regionImages";
import type { ItineraryDay } from "@/types/trip";
import type { TourListItem } from "@/types/sanity-tour";

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!cleanText(value)) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
        {label}
      </p>
      <p className="mt-1.5 text-[15px] leading-7 text-foreground/90">{value}</p>
    </div>
  );
}

type DaySectionProps = {
  day: ItineraryDay;
  index: number;
  isLast: boolean;
  tours: TourListItem[];
};

export function DaySection({ day, index, isLast, tours }: DaySectionProps) {
  const region = cleanText(day.region);
  const title = cleanText(day.title);
  const numeral = String(day.day ?? index + 1).padStart(2, "0");
  const image = region ? getRegionImage(region) : null;

  return (
    <article className="relative flex gap-4 sm:gap-6">
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute left-6 top-12 hidden w-px bg-stone-300 sm:block"
          style={{ bottom: "-5rem" }}
        />
      ) : null}
      <span
        aria-hidden="true"
        className="relative z-10 hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-background text-xs font-semibold text-amber-800 shadow-sm sm:flex"
      >
        {numeral}
      </span>
      <div className="relative z-10 flex-col  w-full ">
        <div className="min-w-0 flex-1 gap-4  md:flex">
          {image ? (
            <div className="relative   overflow-hidden rounded-2xl min-w-full sm:min-w-[450px] min-h-40 sm:min-h-52">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 680px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3 sm:inset-x-5">
                {region ? (
                  <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {region}
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="font-[family-name:var(--font-fraunces)] text-4xl italic leading-none text-amber-800/70 sm:hidden">
              {numeral}
            </p>
          )}

          <div className="max-w-full  space-y-4 ">
            <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Day {day.day}
              {title ? `: ${title}` : ""}
            </h3>

            <div className="grid gap-2 sm:gap-4 sm:grid-cols-3">
              <DetailRow label="Morning" value={day.morning} />
              <DetailRow label="Afternoon" value={day.afternoon} />
              <DetailRow label="Evening" value={day.evening} />
            </div>

            {cleanText(day.foodSuggestion) || cleanText(day.travelTip) ? (
              <div className=" space-y-1 md:space-y-3 border-t border-stone-200 pt-1 md:pt-4">
                {cleanText(day.foodSuggestion) ? (
                  <p className="flex gap-2 text-sm leading-6 text-muted-foreground">
                    <Utensils
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                      aria-hidden="true"
                    />
                    <span>{day.foodSuggestion}</span>
                  </p>
                ) : null}
                {cleanText(day.travelTip) ? (
                  <p className="flex gap-2 text-sm leading-6 text-muted-foreground">
                    <Lightbulb
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                      aria-hidden="true"
                    />
                    <span>{day.travelTip}</span>
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        {region ? (
          <DayRecommendations dayRegion={region} tours={tours} />
        ) : null}
      </div>
    </article>
  );
}
