import { findRegionGroup } from "@/lib/itinerary/matchRegion";
import type { ItineraryDay } from "@/types/trip";

export type RegionImage = {
  src: string;
  alt: string;
};

const GENERIC_FALLBACK: RegionImage = {
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Greater_Caucasus_Mountains_in_Georgia.jpg/1920px-The_Greater_Caucasus_Mountains_in_Georgia.jpg",
  alt: "The Greater Caucasus Mountains in Georgia",
};

// Wikimedia Commons photos (same hotlinking pattern already used by HeroSection.tsx
// and TourHero.tsx's fallback image) — free-licensed, hosted on a domain already
// whitelisted in next.config.mjs's images.remotePatterns.
const REGION_IMAGES: Record<string, RegionImage> = {
  tbilisi: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/View_of_Tbilisi_from_Tabori_Church_2023-10-08-2.jpg/1920px-View_of_Tbilisi_from_Tabori_Church_2023-10-08-2.jpg",
    alt: "View of Tbilisi's Old Town from Tabori Church",
  },
  kazbegi: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/View_of_Stepantsminda_09.23.jpg/1920px-View_of_Stepantsminda_09.23.jpg",
    alt: "View of Stepantsminda (Kazbegi) beneath the Caucasus mountains",
  },
  svaneti: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Mestia_with_Svan_towers.jpg/1920px-Mestia_with_Svan_towers.jpg",
    alt: "Svan defensive towers in Mestia, Svaneti",
  },
  kakheti: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/General_view_of_Sighnaghi%2C_Georiga.jpg/1920px-General_view_of_Sighnaghi%2C_Georiga.jpg",
    alt: "General view of Sighnaghi, Kakheti",
  },
  batumi: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Batumi_Boulevard_Alley.jpg/1920px-Batumi_Boulevard_Alley.jpg",
    alt: "Batumi's Black Sea boulevard",
  },
  "kutaisi-imereti": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Bagrati_Cathedral_%28Kutaisi%29_03.jpg/1920px-Bagrati_Cathedral_%28Kutaisi%29_03.jpg",
    alt: "Bagrati Cathedral in Kutaisi, Imereti",
  },
  mtskheta: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/View_to_Mtskheta_from_Jvari.jpg/1920px-View_to_Mtskheta_from_Jvari.jpg",
    alt: "View of Mtskheta from Jvari Monastery",
  },
  "gori-uplistsikhe": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Middle_ages_Basilica_on_the_top_of_the_cave%2C_Uplistsikhe_20230920_%28II%29.jpg/1920px-Middle_ages_Basilica_on_the_top_of_the_cave%2C_Uplistsikhe_20230920_%28II%29.jpg",
    alt: "The cave town of Uplistsikhe near Gori",
  },
};

/**
 * Display-only refinement layered on top of matchRegion's REGION_GROUPS — the
 * "mtskheta-gori" group covers both tour-matching regions, but each deserves
 * a distinct photo. This doesn't reclassify anything, it only picks which
 * image best represents an already-matched group.
 */
function imageKeyForGroup(groupKey: string, regionText: string): string {
  if (groupKey !== "mtskheta-gori") return groupKey;

  const normalized = regionText.toLowerCase();
  return normalized.includes("gori") || normalized.includes("uplistsikhe")
    ? "gori-uplistsikhe"
    : "mtskheta";
}

export function getRegionImage(regionText: string): RegionImage {
  const group = findRegionGroup(regionText);
  if (!group) return GENERIC_FALLBACK;

  const imageKey = imageKeyForGroup(group.key, regionText);
  return REGION_IMAGES[imageKey] ?? GENERIC_FALLBACK;
}

/** Picks the most-frequently-visited known region across the trip, for the hero image. */
export function getPrimaryRegionImage(days: Pick<ItineraryDay, "region">[]): RegionImage {
  const counts = new Map<string, { count: number; sample: string }>();

  for (const day of days) {
    const region = day.region?.trim();
    if (!region) continue;

    const group = findRegionGroup(region);
    if (!group) continue;

    const imageKey = imageKeyForGroup(group.key, region);
    const existing = counts.get(imageKey);
    counts.set(imageKey, { count: (existing?.count ?? 0) + 1, sample: existing?.sample ?? region });
  }

  let best: { imageKey: string; sample: string; count: number } | null = null;
  for (const [imageKey, { count, sample }] of counts) {
    if (!best || count > best.count) {
      best = { imageKey, sample, count };
    }
  }

  if (!best) return GENERIC_FALLBACK;
  return REGION_IMAGES[best.imageKey] ?? GENERIC_FALLBACK;
}
