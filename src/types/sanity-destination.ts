import type { PortableTextBlock } from "next-sanity";
import type { BlogPostListItem } from "@/types/sanity-blog";
import type { SanityImage, TourListItem } from "@/types/sanity-tour";

export type DestinationType = "region" | "city" | "area";

/** Minimal live-destination link used for "Explore <Destination>" chips and breadcrumbs. */
export type DestinationLink = {
  title: string;
  slug: string;
};

export type DestinationQuickFacts = {
  distanceFromTbilisiKm?: number | null;
  driveTimeFromTbilisi?: string | null;
  bestTimeToVisit?: string | null;
  daysNeeded?: string | null;
  nearestAirport?: string | null;
  gettingThere?: string | null;
};

export type DestinationHighlight = {
  _key: string;
  name: string;
  description?: string | null;
  image?: SanityImage | null;
  url?: string | null;
  post?: DestinationLink | null;
};

export type DestinationSampleItinerary = {
  _key: string;
  title?: string | null;
  duration?: string | null;
  stops?: string[] | null;
  description?: string | null;
};

export type DestinationFAQItem = {
  _key: string;
  question?: string | null;
  answer?: string | null;
};

export type DestinationGeopoint = {
  lat?: number | null;
  lng?: number | null;
  alt?: number | null;
};

export type DestinationListItem = {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: string;
  destinationType?: DestinationType | null;
  excerpt?: string | null;
  heroImage?: SanityImage | null;
  guideCount: number;
  tourCount: number;
};

export type Destination = Omit<DestinationListItem, "guideCount" | "tourCount"> & {
  metaTitle?: string | null;
  metaDescription?: string | null;
  intro: PortableTextBlock[];
  quickFacts?: DestinationQuickFacts | null;
  highlights: DestinationHighlight[];
  body: PortableTextBlock[];
  sampleItineraries: DestinationSampleItinerary[];
  whereToStay: PortableTextBlock[];
  faq: DestinationFAQItem[];
  coordinates?: DestinationGeopoint | null;
  relatedDestinations: DestinationListItem[];
  featuredPosts: BlogPostListItem[];
  referencingPosts: BlogPostListItem[];
  tours: TourListItem[];
};
