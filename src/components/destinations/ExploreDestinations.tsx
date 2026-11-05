import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DestinationLink } from "@/types/sanity-destination";

/**
 * "Explore <Destination>" chips for blog posts and tours. Callers pass live destinations only
 * (the GROQ projection already filters on isLive).
 */
export function ExploreDestinations({
  destinations,
  className,
  chipClassName,
}: {
  destinations?: DestinationLink[] | null;
  className?: string;
  chipClassName?: string;
}) {
  const items = destinations?.filter((destination) => destination.slug) ?? [];
  if (items.length === 0) return null;

  return (
    <nav aria-label="Related destinations" className={cn("flex flex-wrap gap-2", className)}>
      {items.map((destination) => (
        <Link
          key={destination.slug}
          href={`/destinations/${destination.slug}`}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            chipClassName,
          )}
        >
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          Explore {destination.title}
        </Link>
      ))}
    </nav>
  );
}
