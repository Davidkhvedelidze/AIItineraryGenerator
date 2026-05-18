"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { getTourPriceSummary } from "@/lib/tour-pricing";
import type { TourListItem } from "@/types/sanity-tour";
import { urlFor } from "@/lib/sanity/image";

type TourCardProps = {
  tour: TourListItem;
};

function getAverageRating(tour: TourListItem) {
  const reviews = tour.reviews?.filter((review) => typeof review.rating === "number") ?? [];
  if (reviews.length === 0) return null;

  const total = reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0);
  return {
    average: total / reviews.length,
    count: reviews.length,
  };
}

export function TourCard({ tour }: TourCardProps) {
  const imageUrl = tour.mainImage?.asset?._ref
    ? urlFor(tour.mainImage)
        .width(720)
        .height(480)
        .fit("crop")
        .auto("format")
        .url()
    : null;
  const rating = getAverageRating(tour);
  const price = getTourPriceSummary(tour);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md"
    >
      {imageUrl ? (
        <Link href={`/tours/${tour.slug}`} className="block">
          <Image
            src={imageUrl}
            alt={tour.title}
            width={720}
            height={480}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, calc(100vw - 32px)"
            className="aspect-[3/2] w-full object-cover"
          />
        </Link>
      ) : null}
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {[...(tour.badges ?? []), ...(tour.regions ?? []).slice(0, 2)]
            .slice(0, 4)
            .map((label) => (
              <span
                key={label}
                className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-foreground ring-1 ring-primary/25"
              >
                {label}
              </span>
            ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            <Link href={`/tours/${tour.slug}`} className="hover:text-amber-700">
              {tour.title}
            </Link>
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {tour.excerpt}
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3 text-sm">
          <div className="space-y-1 text-muted-foreground">
            {tour.duration ? <p>{tour.duration}</p> : null}
            {tour.startingLocation ? (
              <p className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-amber-700" aria-hidden="true" />
                <span>{tour.startingLocation}</span>
              </p>
            ) : null}
            {rating ? (
              <p className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                <span>
                  {rating.average.toFixed(1)} ({rating.count} review
                  {rating.count === 1 ? "" : "s"})
                </span>
              </p>
            ) : null}
          </div>
          {price ? (
            <p className="text-right font-semibold text-foreground">
              {price.label === "Price from" ? "From " : ""}
              {price.value}
            </p>
          ) : null}
        </div>
        <Link
          href={`/tours/${tour.slug}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          View tour
        </Link>
      </div>
    </motion.article>
  );
}
