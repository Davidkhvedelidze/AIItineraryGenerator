import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { GalleryListItem } from "@/lib/supabase/itineraryRequests";

function formatLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function GalleryCard({ item }: { item: GalleryListItem }) {
  return (
    <Link
      href={`/trip-ideas/community/${item.shortId}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={item.regionImage.src}
          alt={item.regionImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-serif text-lg font-semibold leading-snug text-foreground">
          {item.shareTitle}
        </h3>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 font-medium text-amber-800">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {item.tripLength} days
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 font-medium text-amber-800">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {item.regionLabel}
          </span>
          <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
            {formatLabel(item.travelStyle)}
          </span>
          <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
            {formatLabel(item.budget)} budget
          </span>
        </div>
      </div>
    </Link>
  );
}
