import groq from "groq";

const blogPostListFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  tags,
  publishedAt,
  mainImage,
  metaTitle,
  metaDescription
`;

export const blogPostsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
    ${blogPostListFields}
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && slug.current == $slug][0] {
    ${blogPostListFields},
    cta {
      title,
      description,
      primaryButtonLabel,
      primaryButtonLink,
      secondaryButtonLabel,
      secondaryButtonLink
    },
    faq,
    body
  }
`;

export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current
  }
`;

const tourListFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage,
  duration,
  startingLocation,
  endingLocation,
  tourType,
  groupType,
  customizable,
  priceFrom,
  pricingTiers,
  currency,
  priceNote,
  tripadvisorUrl,
  directBookingEnabled,
  bestFor,
  regions,
  badges,
  reviews
`;

export const toursQuery = groq`
  *[_type == "tour" && defined(slug.current)] | order(_createdAt desc) {
    ${tourListFields}
  }
`;

export const tourBySlugQuery = groq`
  *[_type == "tour" && defined(slug.current) && slug.current == $slug][0] {
    ${tourListFields},
    gallery,
    overview,
    highlights,
    itinerary,
    included,
    notIncluded,
    pickupInfo,
    pickupLocations,
    departureTimes,
    cancellationPolicy,
    bookingCutoff,
    confirmationMethod,
    maxTravelers,
    ageGroups,
    requiredTravelerInfo,
    operatingDays,
    operatorCancellationRights,
    bookingNotificationNote,
    guideLanguage,
    guideNote,
    audioGuide,
    writtenGuide,
    difficultyLevel,
    airport,
    contactPhone,
    listingName,
    listingLocation,
    directBookingCtaTitle,
    directBookingCtaText,
    tripadvisorCtaTitle,
    tripadvisorCtaText,
    importantNotes,
    accessibilityNotes,
    healthNotes,
    faq,
    reviews,
    metaTitle,
    metaDescription
  }
`;

export const tourSlugsQuery = groq`
  *[_type == "tour" && defined(slug.current)] {
    "slug": slug.current
  }
`;
