import type { Tour, TourListItem } from "@/types/sanity-tour";
import {
  MissingSanityProjectIdError,
  assertSanityProjectId,
  sanityClient,
} from "@/lib/sanity/client";
import {
  tourBySlugQuery,
  tourSlugsQuery,
  toursQuery,
} from "@/lib/sanity/queries";

type TourSlug = {
  slug: string;
};

const sanityFetchOptions =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" as const }
    : { next: { revalidate: 60 } };

export async function getAllTours(): Promise<TourListItem[]> {
  try {
    assertSanityProjectId();

    return await sanityClient.fetch<TourListItem[]>(
      toursQuery,
      {},
      sanityFetchOptions,
    );
  } catch (error) {
    if (error instanceof MissingSanityProjectIdError) {
      throw error;
    }

    console.error("Failed to fetch Sanity tours:", error);
    return [];
  }
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    assertSanityProjectId();

    return await sanityClient.fetch<Tour | null>(
      tourBySlugQuery,
      { slug },
      sanityFetchOptions,
    );
  } catch (error) {
    if (error instanceof MissingSanityProjectIdError) {
      throw error;
    }

    console.error(`Failed to fetch Sanity tour for slug "${slug}":`, error);
    return null;
  }
}

export async function getTourSlugs(): Promise<TourSlug[]> {
  try {
    assertSanityProjectId();

    return await sanityClient.fetch<TourSlug[]>(
      tourSlugsQuery,
      {},
      sanityFetchOptions,
    );
  } catch (error) {
    if (error instanceof MissingSanityProjectIdError) {
      throw error;
    }

    console.error("Failed to fetch Sanity tour slugs:", error);
    return [];
  }
}
