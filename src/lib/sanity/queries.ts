import groq from "groq";

/** Live destinations referenced by a blog post or tour, in the order the editor set them. */
const liveDestinationLinksProjection = groq`coalesce(destinations[@->isLive == true && defined(@->slug.current)]->{
    title,
    "slug": slug.current
  }, [])`;

const blogPostListFields = groq`
  _id,
  _updatedAt,
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
  *[_type == "blogPost" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
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
    body,
    "destinations": ${liveDestinationLinksProjection}
  }
`;

export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current
  }
`;

const tourListFields = groq`
  _id,
  _updatedAt,
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
    metaDescription,
    "destinations": ${liveDestinationLinksProjection}
  }
`;

export const tourSlugsQuery = groq`
  *[_type == "tour" && defined(slug.current)] {
    "slug": slug.current
  }
`;

const destinationCardFields = groq`
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  destinationType,
  excerpt,
  heroImage,
  "guideCount": count(*[_type == "blogPost" && defined(slug.current) && (references(^._id) || _id in coalesce(^.featuredPosts[]._ref, []))]),
  "tourCount": count(*[_type == "tour" && defined(slug.current) && references(^._id)])
`;

export const liveDestinationsQuery = groq`
  *[_type == "destination" && isLive == true && defined(slug.current)] | order(coalesce(order, 9999) asc, title asc) {
    ${destinationCardFields}
  }
`;

export const liveDestinationSlugsQuery = groq`
  *[_type == "destination" && isLive == true && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const liveDestinationBySlugQuery = groq`
  *[_type == "destination" && isLive == true && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    destinationType,
    excerpt,
    metaTitle,
    metaDescription,
    heroImage,
    "intro": coalesce(intro, []),
    quickFacts,
    "highlights": coalesce(highlights[defined(name)] {
      _key,
      name,
      description,
      image,
      url,
      "post": select(defined(post->slug.current) => post-> {
        title,
        "slug": slug.current
      })
    }, []),
    "body": coalesce(body, []),
    "sampleItineraries": coalesce(sampleItineraries[] {
      _key,
      title,
      duration,
      stops,
      description
    }, []),
    "whereToStay": coalesce(whereToStay, []),
    "faq": coalesce(faq[] {
      _key,
      question,
      answer
    }, []),
    coordinates,
    "relatedDestinations": coalesce(relatedDestinations[@->isLive == true]-> {
      ${destinationCardFields}
    }, []),
    "featuredPosts": coalesce(featuredPosts[defined(@->slug.current)]-> {
      ${blogPostListFields}
    }, []),
    "referencingPosts": *[_type == "blogPost" && defined(slug.current) && references(^._id)] | order(coalesce(publishedAt, _createdAt) desc) {
      ${blogPostListFields}
    },
    "tours": *[_type == "tour" && defined(slug.current) && references(^._id)] | order(_createdAt desc) {
      ${tourListFields}
    }
  }
`;
