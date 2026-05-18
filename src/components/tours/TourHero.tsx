import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ExternalLink,
} from "lucide-react";
import type { Tour } from "@/types/sanity-tour";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { normalizeExternalUrl } from "@/lib/utils";

type TourHeroProps = {
  tour: Tour;
};

export function TourHero({ tour }: TourHeroProps) {
  const imageUrl = getSanityImageUrl(tour.mainImage, {
    width: 1800,
    height: 1000,
    fit: "crop",
  });
  const tripadvisorUrl = normalizeExternalUrl(tour.tripadvisorUrl);
  const badges = Array.from(
    new Set(
      [tour.groupType, tour.tourType, ...(tour.badges ?? [])].filter(Boolean),
    ),
  ).slice(0, 5);
  return (
    <section className="bg-background pt-4 sm:pt-5">
      <div className="">
        <div className="relative isolate overflow-hidden  bg-black text-white shadow-xl ring-1 ring-black/5">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={tour.mainImage?.alt || tour.title}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1280px) 1280px, calc(100vw - 32px)"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          ) : (
            <div className="absolute inset-0 bg-[#F5B700]" />
          )}
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-black/35" />
          <div className="container">
            <div className="relative flex min-h-[460px] items-end p-5 sm:min-h-[500px] sm:p-8 lg:min-h-[620px] lg:p-10">
              <div className="w-full max-w-5xl space-y-5">
                {badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {badges.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur"
                      >
                        <BadgeCheck
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        {label}
                      </span>
                    ))}
                  </div>
                ) : null}

                <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  {tour.title}
                </h1>

                <p className="max-w-3xl text-base leading-8 text-white/90 sm:text-lg">
                  {tour.excerpt}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {tour.directBookingEnabled !== false ? (
                    <a
                      href="#booking"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
                    >
                      <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                      Request Direct Booking
                    </a>
                  ) : null}
                  {tripadvisorUrl ? (
                    <a
                      href={tripadvisorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/45 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Book on TripAdvisor
                    </a>
                  ) : null}
                  <Link
                    href="/tours"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    All tours
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
