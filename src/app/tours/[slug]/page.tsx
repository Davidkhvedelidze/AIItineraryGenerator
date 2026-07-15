import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Info, MinusCircle } from "lucide-react";
import { FAQSection } from "@/components/seo/FAQSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  TourBookingBox,
  type TourBookingBoxTour,
} from "@/components/tours/TourBookingBox";
import { TourBookingDetails } from "@/components/tours/TourBookingDetails";
import { TourCard } from "@/components/tours/TourCard";
import { TourCTA } from "@/components/tours/TourCTA";
import { TourGallery } from "@/components/tours/TourGallery";
import { TourHero } from "@/components/tours/TourHero";
import { TourHighlights } from "@/components/tours/TourHighlights";
import { TourItinerary } from "@/components/tours/TourItinerary";
import { TourOverview } from "@/components/tours/TourOverview";
import { TourPricing } from "@/components/tours/TourPricing";
import { TourQuickFacts } from "@/components/tours/TourQuickFacts";
import { TourReviews } from "@/components/tours/TourReviews";
import { buildFAQJsonLd } from "@/lib/seo/faqJsonLd";
import { getSanityImageUrl, hasSanityImage } from "@/lib/sanity/image";
import { getSiteUrl } from "@/lib/site";
import { getAllTours, getTourBySlug, getTourSlugs } from "@/lib/tours";
import type { Tour, TourPricingTier, TourReview } from "@/types/sanity-tour";

type TourPageProps = {
  params: { slug: string };
};

function getVisibleItems(items?: string[]) {
  return items?.filter(Boolean) ?? [];
}

function getRatedReviews(reviews?: TourReview[]) {
  return reviews?.filter((review) => typeof review.rating === "number") ?? [];
}

function getAverageRating(reviews?: TourReview[]) {
  const ratedReviews = getRatedReviews(reviews);
  if (ratedReviews.length === 0) return null;

  const total = ratedReviews.reduce(
    (sum, review) => sum + (review.rating ?? 0),
    0,
  );
  return {
    average: Number((total / ratedReviews.length).toFixed(1)),
    count: ratedReviews.length,
  };
}

function getBookingBoxTour(tour: Tour): TourBookingBoxTour {
  return {
    slug: tour.slug,
    title: tour.title,
    priceFrom: tour.priceFrom,
    currency: tour.currency,
    pricingTiers: tour.pricingTiers,
    priceNote: tour.priceNote,
    tripadvisorUrl: tour.tripadvisorUrl,
    directBookingEnabled: tour.directBookingEnabled,
    maxTravelers: tour.maxTravelers,
    confirmationMethod: tour.confirmationMethod,
    airport: tour.airport,
    pickupInfo: tour.pickupInfo,
    cancellationPolicy: tour.cancellationPolicy,
    directBookingCtaTitle: tour.directBookingCtaTitle,
    directBookingCtaText: tour.directBookingCtaText,
  };
}

function buildTourOffers(tour: Tour, pageUrl: string) {
  const tiers = tour.pricingTiers?.filter(
    (tier): tier is TourPricingTier & { price: number } => typeof tier.price === "number",
  );

  if (tiers && tiers.length > 1) {
    const prices = tiers.map((tier) => tier.price);
    return {
      "@type": "AggregateOffer",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      priceCurrency: tiers[0].currency || tour.currency || "USD",
      offerCount: tiers.length,
      url: pageUrl,
    };
  }

  if (typeof tour.priceFrom === "number" && tour.priceFrom > 0) {
    return {
      "@type": "Offer",
      price: tour.priceFrom,
      priceCurrency: tour.currency || "USD",
      availability: "https://schema.org/InStock",
      url: pageUrl,
      description: tour.priceNote || undefined,
    };
  }

  return undefined;
}

function buildTourJsonLd(tour: Tour, imageUrl: string | null, pageUrl: string, siteUrl: string) {
  const rating = getAverageRating(tour.reviews);
  const itineraryItems =
    tour.itinerary
      ?.filter((item) => item.title || item.description || item.stops?.length)
      .map((item, index) => ({
        "@type": "ListItem",
        position: item.day ?? index + 1,
        name: item.title || `Day ${item.day ?? index + 1}`,
        description: item.description,
        areaServed: item.region,
      })) ?? [];
  const reviews = tour.reviews
    ?.filter((review) => review.text || review.reviewerName)
    .slice(0, 5)
    .map((review) => ({
      "@type": "Review",
      author: review.reviewerName
        ? {
            "@type": "Person",
            name: review.reviewerName,
          }
        : undefined,
      reviewBody: review.text,
      reviewRating:
        typeof review.rating === "number"
          ? {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
            }
          : undefined,
      datePublished: review.reviewDate,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.metaDescription || tour.excerpt,
    url: pageUrl,
    image: imageUrl ? [imageUrl] : undefined,
    provider: { "@id": `${siteUrl}/#organization` },
    touristType: tour.bestFor?.length ? tour.bestFor : undefined,
    location:
      [tour.startingLocation, tour.endingLocation]
        .filter(Boolean)
        .join(" to ") || undefined,
    itinerary:
      itineraryItems.length > 0
        ? {
            "@type": "ItemList",
            itemListElement: itineraryItems,
          }
        : undefined,
    offers: buildTourOffers(tour, pageUrl),
    aggregateRating: rating
      ? {
          "@type": "AggregateRating",
          ratingValue: rating.average,
          reviewCount: rating.count,
        }
      : undefined,
    review: reviews?.length ? reviews : undefined,
  };
}

function TourSectionNav({ tour, hasFaq }: { tour: Tour; hasFaq: boolean }) {
  const links = [
    {
      href: "#overview",
      label: "Overview",
      show: Boolean(tour.overview?.length),
    },
    {
      href: "#gallery",
      label: "Gallery",
      show:
        hasSanityImage(tour.mainImage) ||
        Boolean(tour.gallery?.some(hasSanityImage)),
    },
    {
      href: "#highlights",
      label: "Highlights",
      show: Boolean(tour.highlights?.length),
    },
    {
      href: "#pricing",
      label: "Pricing",
      show: Boolean(
        typeof tour.priceFrom === "number" ||
        tour.pricingTiers?.length ||
        tour.priceNote,
      ),
    },
    {
      href: "#itinerary",
      label: "Itinerary",
      show: Boolean(tour.itinerary?.length),
    },
    {
      href: "#included",
      label: "Included",
      show: Boolean(tour.included?.length || tour.notIncluded?.length),
    },
    {
      href: "#details",
      label: "Details",
      show: Boolean(
        tour.pickupInfo ||
        tour.pickupLocations?.length ||
        tour.departureTimes?.length ||
        tour.operatingDays?.length ||
        tour.cancellationPolicy ||
        tour.requiredTravelerInfo?.length ||
        tour.ageGroups?.length,
      ),
    },
    {
      href: "#reviews",
      label: "Reviews",
      show: Boolean(tour.reviews?.length || tour.tripadvisorUrl),
    },
    { href: "#faq", label: "FAQ", show: hasFaq },
  ].filter((link) => link.show);

  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Tour page sections"
      className="sticky top-[var(--header-height)] z-30 overflow-x-auto border-y bg-background/95 px-4 py-3 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl gap-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-full border bg-card px-3 py-1.5 text-sm font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function InclusionCard({
  title,
  items,
  positive = true,
}: {
  title: string;
  items?: string[];
  positive?: boolean;
}) {
  const visibleItems = getVisibleItems(items);
  if (visibleItems.length === 0) return null;

  const Icon = positive ? CheckCircle2 : MinusCircle;

  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
        {visibleItems.map((item) => (
          <li key={item} className="flex gap-3">
            <Icon
              className={
                positive
                  ? "mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                  : "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
              }
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function InclusionsSection({ tour }: { tour: Tour }) {
  if (!tour.included?.length && !tour.notIncluded?.length) return null;

  return (
    <section id="included" className="scroll-mt-24 space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          What is covered
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Included / Not included
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <InclusionCard title="Included" items={tour.included} />
        <InclusionCard
          title="Not included"
          items={tour.notIncluded}
          positive={false}
        />
      </div>
    </section>
  );
}

function ImportantNotes({ notes }: { notes?: string[] }) {
  const items = getVisibleItems(notes);
  if (items.length === 0) return null;

  return (
    <section
      id="important-notes"
      className="scroll-mt-24 rounded-2xl border bg-card p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-amber-700" aria-hidden="true" />
        <h2 className="text-xl font-semibold tracking-tight">
          Important notes
        </h2>
      </div>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-muted px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function generateStaticParams() {
  const slugs = await getTourSlugs();

  return slugs.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({
  params,
}: TourPageProps): Promise<Metadata> {
  const tour = await getTourBySlug(params.slug);

  if (!tour) return { title: "Tour Not Found" };

  const title = tour.metaTitle || `${tour.title} - TripMate Georgia`;
  const description = tour.metaDescription || tour.excerpt;
  const imageUrl = getSanityImageUrl(tour.mainImage, {
    width: 1200,
    height: 630,
    fit: "crop",
  });

  return {
    title,
    description,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/tours/${tour.slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: tour.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function TourDetailPage({ params }: TourPageProps) {
  const tour = await getTourBySlug(params.slug);
  if (!tour) notFound();

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/tours/${tour.slug}`;
  const mainImageUrl = getSanityImageUrl(tour.mainImage, {
    width: 1600,
    height: 900,
    fit: "crop",
  });
  const faqItems =
    tour.faq
      ?.filter((item): item is { question: string; answer: string } =>
        Boolean(item.question && item.answer),
      )
      .map((item) => ({ question: item.question, answer: item.answer })) ?? [];
  const tourJsonLd = buildTourJsonLd(tour, mainImageUrl, pageUrl, siteUrl);
  const faqJsonLd = faqItems.length > 0 ? buildFAQJsonLd(faqItems) : null;
  const bookingTour = getBookingBoxTour(tour);
  const relatedTours = (await getAllTours())
    .filter((relatedTour) => relatedTour.slug !== tour.slug)
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJsonLd) }}
        />
        {faqJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        ) : null}

        <TourHero tour={tour} />
        <TourSectionNav tour={tour} hasFaq={faqItems.length > 0} />

        <div className="container py-8 sm:py-10">
          <div className="mx-auto max-w-6xl space-y-10">
            <TourQuickFacts tour={tour} />

            <div id="booking" className="scroll-mt-24 lg:hidden">
              <TourBookingBox tour={bookingTour} compact />
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <article className="space-y-10">
                <TourOverview overview={tour.overview} />
                <TourGallery
                  mainImage={tour.mainImage}
                  images={tour.gallery}
                  title={tour.title}
                />
                <TourHighlights highlights={tour.highlights} />
                <TourPricing tour={tour} />
                <TourItinerary items={tour.itinerary} />
                <InclusionsSection tour={tour} />
                <TourBookingDetails tour={tour} />
                <ImportantNotes notes={tour.importantNotes} />
                <TourReviews
                  reviews={tour.reviews}
                  tripadvisorUrl={tour.tripadvisorUrl}
                />

                {faqItems.length > 0 ? (
                  <div id="faq" className="scroll-mt-24">
                    <FAQSection items={faqItems} />
                  </div>
                ) : null}

                <TourCTA
                  tripadvisorUrl={tour.tripadvisorUrl}
                  directBookingEnabled={tour.directBookingEnabled !== false}
                />
              </article>

              <div className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
                <TourBookingBox tour={bookingTour} compact />
              </div>
            </div>

            {relatedTours.length > 0 ? (
              <section className="space-y-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                    Keep exploring
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    Related tours
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  {relatedTours.map((relatedTour) => (
                    <TourCard key={relatedTour.slug} tour={relatedTour} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
