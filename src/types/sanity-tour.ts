import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  _type?: "image";
  _key?: string;
  alt?: string;
  asset?: {
    _ref?: string;
    _type?: "reference";
  };
  hotspot?: unknown;
  crop?: unknown;
};

export type TourItineraryItem = {
  day?: number;
  title?: string;
  region?: string;
  description?: string;
  stops?: string[];
  mealsIncluded?: boolean;
  accommodationIncluded?: boolean;
};

export type TourPricingTier = {
  label?: string;
  price?: number;
  currency?: string;
  note?: string;
};

export type TourAgeGroup = {
  label?: string;
  range?: string;
  note?: string;
};

export type TourFAQItem = {
  question?: string;
  answer?: string;
};

export type TourReview = {
  reviewerName?: string;
  country?: string;
  rating?: number;
  text?: string;
  source?: string;
  reviewDate?: string;
};

export type TourListItem = {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage?: SanityImage;
  duration?: string;
  startingLocation?: string;
  endingLocation?: string;
  tourType?: string;
  groupType?: string;
  customizable?: boolean;
  priceFrom?: number;
  pricingTiers?: TourPricingTier[];
  currency?: string;
  priceNote?: string;
  tripadvisorUrl?: string;
  directBookingEnabled?: boolean;
  bestFor?: string[];
  regions?: string[];
  badges?: string[];
  reviews?: TourReview[];
};

export type Tour = TourListItem & {
  gallery?: SanityImage[];
  overview?: PortableTextBlock[];
  highlights?: string[];
  itinerary?: TourItineraryItem[];
  included?: string[];
  notIncluded?: string[];
  pickupInfo?: string;
  pickupLocations?: string[];
  departureTimes?: string[];
  cancellationPolicy?: string;
  bookingCutoff?: string;
  confirmationMethod?: string;
  maxTravelers?: number;
  ageGroups?: TourAgeGroup[];
  requiredTravelerInfo?: string[];
  operatingDays?: string[];
  operatorCancellationRights?: string;
  bookingNotificationNote?: string;
  guideLanguage?: string;
  guideNote?: string;
  audioGuide?: string;
  writtenGuide?: string;
  difficultyLevel?: string;
  airport?: string;
  contactPhone?: string;
  listingName?: string;
  listingLocation?: string;
  directBookingCtaTitle?: string;
  directBookingCtaText?: string;
  tripadvisorCtaTitle?: string;
  tripadvisorCtaText?: string;
  importantNotes?: string[];
  accessibilityNotes?: string[];
  healthNotes?: string[];
  faq?: TourFAQItem[];
  metaTitle?: string;
  metaDescription?: string;
};
