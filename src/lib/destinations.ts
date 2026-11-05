import type { BlogPostListItem } from "@/types/sanity-blog";
import type { Destination, DestinationListItem } from "@/types/sanity-destination";
import { MissingSanityProjectIdError, assertSanityProjectId, sanityClient } from "@/lib/sanity/client";
import {
  liveDestinationBySlugQuery,
  liveDestinationSlugsQuery,
  liveDestinationsQuery,
} from "@/lib/sanity/queries";

type DestinationSlug = {
  slug: string;
};

// Same strategy as blog posts: hourly ISR in production, refreshed earlier by the
// Sanity webhook (/api/revalidate).
const sanityFetchOptions =
  process.env.NODE_ENV === "development" ? { cache: "no-store" as const } : { next: { revalidate: 3600 } };

/** Only destinations with isLive == true are ever returned. */
export async function getLiveDestinations(): Promise<DestinationListItem[]> {
  try {
    assertSanityProjectId();

    return await sanityClient.fetch<DestinationListItem[]>(liveDestinationsQuery, {}, sanityFetchOptions);
  } catch (error) {
    if (error instanceof MissingSanityProjectIdError) {
      throw error;
    }

    console.error("Failed to fetch Sanity destinations:", error);
    return [];
  }
}

export async function getLiveDestinationSlugs(): Promise<DestinationSlug[]> {
  try {
    assertSanityProjectId();

    return await sanityClient.fetch<DestinationSlug[]>(liveDestinationSlugsQuery, {}, sanityFetchOptions);
  } catch (error) {
    if (error instanceof MissingSanityProjectIdError) {
      throw error;
    }

    console.error("Failed to fetch Sanity destination slugs:", error);
    return [];
  }
}

/** Returns null when the destination does not exist or is not live. */
export async function getLiveDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    assertSanityProjectId();

    return await sanityClient.fetch<Destination | null>(liveDestinationBySlugQuery, { slug }, sanityFetchOptions);
  } catch (error) {
    if (error instanceof MissingSanityProjectIdError) {
      throw error;
    }

    console.error(`Failed to fetch Sanity destination for slug "${slug}":`, error);
    return null;
  }
}

/** Featured (pinned) posts first, then every post that references the destination, newest first. */
export function getDestinationGuides(destination: Destination): BlogPostListItem[] {
  const seen = new Set<string>();

  return [...destination.featuredPosts, ...destination.referencingPosts].filter((post) => {
    if (!post?.slug || seen.has(post._id)) return false;
    seen.add(post._id);
    return true;
  });
}
