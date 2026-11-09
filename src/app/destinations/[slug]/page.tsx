import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogBookingLink } from "@/components/blog/BlogBookingLink";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { DestinationBreadcrumb } from "@/components/destinations/DestinationBreadcrumb";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationFAQ, type DestinationFAQEntry } from "@/components/destinations/DestinationFAQ";
import { DestinationHighlights } from "@/components/destinations/DestinationHighlights";
import { DestinationItineraries } from "@/components/destinations/DestinationItineraries";
import { DestinationQuickFacts, hasQuickFacts } from "@/components/destinations/DestinationQuickFacts";
import { DestinationSectionHeading } from "@/components/destinations/DestinationSectionHeading";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { TourCard } from "@/components/tours/TourCard";
import { getDestinationGuides, getLiveDestinationBySlug, getLiveDestinationSlugs } from "@/lib/destinations";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbJsonLd";
import { getSiteUrl } from "@/lib/site";
import type { Destination } from "@/types/sanity-destination";
import styles from "@/components/blog/blog.module.css";

type DestinationPageProps = {
  params: { slug: string };
};

const destinationTypeLabels: Record<string, string> = {
  region: "Region",
  city: "City",
  area: "Area",
};

export async function generateStaticParams() {
  const slugs = await getLiveDestinationSlugs();
  return slugs.map((destination) => ({ slug: destination.slug }));
}

function getMetaTitle(destination: Destination) {
  return destination.metaTitle?.trim() || `${destination.title} Travel Guide | TripMate Georgia`;
}

function getMetaDescription(destination: Destination) {
  return destination.metaDescription?.trim() || destination.excerpt || undefined;
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const destination = await getLiveDestinationBySlug(params.slug);
  if (!destination) return { title: "Destination Not Found", robots: { index: false, follow: true } };

  const title = getMetaTitle(destination);
  const description = getMetaDescription(destination);
  const url = `${getSiteUrl()}/destinations/${destination.slug}`;
  const imageUrl = getSanityImageUrl(destination.heroImage, { width: 1200, height: 630, fit: "crop" });
  const imageAlt = destination.heroImage?.alt || destination.title;

  return {
    // metaTitle / fallback already carry the brand, so skip the root "%s | TripMate Georgia" template.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

function buildDestinationJsonLd(destination: Destination, pageUrl: string, imageUrl: string | null) {
  const { lat, lng } = destination.coordinates ?? {};

  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.title,
    description: getMetaDescription(destination),
    url: pageUrl,
    image: imageUrl ? [imageUrl] : undefined,
    geo:
      typeof lat === "number" && typeof lng === "number"
        ? { "@type": "GeoCoordinates", latitude: lat, longitude: lng }
        : undefined,
    containedInPlace: { "@type": "Country", name: "Georgia" },
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const destination = await getLiveDestinationBySlug(params.slug);
  if (!destination) notFound();

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/destinations/${destination.slug}`;
  const heroImageUrl = getSanityImageUrl(destination.heroImage, { width: 1600, height: 800, fit: "crop" });
  const typeLabel = destination.destinationType ? destinationTypeLabels[destination.destinationType] : null;
  const guides = getDestinationGuides(destination);
  const faqItems: DestinationFAQEntry[] = destination.faq.flatMap((item) =>
    item.question?.trim() && item.answer?.trim()
      ? [{ key: item._key, question: item.question, answer: item.answer }]
      : [],
  );
  const itineraries = destination.sampleItineraries.filter(
    (itinerary) => itinerary.title || itinerary.description || itinerary.stops?.length,
  );

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Destinations", url: `${siteUrl}/destinations` },
    { name: destination.title, url: pageUrl },
  ]);
  const toursJsonLd =
    destination.tours.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Tours in ${destination.title}`,
          itemListElement: destination.tours.map((tour, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}/tours/${tour.slug}`,
            name: tour.title,
          })),
        }
      : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className={`flex-1 ${styles.journal}`}>
        <JsonLd data={buildDestinationJsonLd(destination, pageUrl, heroImageUrl)} />
        <JsonLd data={breadcrumbJsonLd} />
        {toursJsonLd ? <JsonLd data={toursJsonLd} /> : null}

        <div className="container max-w-6xl pb-16 pt-6 sm:pb-20 sm:pt-8">
          <DestinationBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Destinations", href: "/destinations" },
              { label: destination.title },
            ]}
          />

          <article>
            <header className="max-w-4xl">
              <p className={`mb-4 text-xs font-semibold uppercase tracking-[.14em] ${styles.accent}`}>
                {typeLabel ? `${typeLabel} · Georgia` : "Georgia"}
              </p>
              <h1 className="font-serif text-4xl font-medium leading-[1.14] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                {destination.title}
              </h1>
            </header>

            {heroImageUrl ? (
              <div className="relative my-8 sm:my-10">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[2/1]">
                  <Image
                    src={heroImageUrl}
                    alt={destination.heroImage?.alt || destination.title}
                    fill
                    priority
                    sizes="(min-width: 1280px) 1120px, calc(100vw - 32px)"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-black/60 to-transparent md:block"
                  />
                </div>
                <div className="mt-4 md:absolute md:bottom-6 md:left-6 md:right-6 md:mt-0">
                  <BlogBookingLink
                    postTitle={destination.title}
                    sourceUrl={pageUrl}
                    location="destination_cover"
                    label="Book a private tour on WhatsApp"
                    className={`${styles.primaryButton} w-full shadow-sm md:w-auto md:ring-1 md:ring-white/30`}
                  />
                </div>
              </div>
            ) : null}

            <div className={`space-y-14 sm:space-y-20 ${heroImageUrl ? "" : "mt-8 sm:mt-10"}`}>
              {destination.intro.length > 0 ? (
                <div className="max-w-3xl">
                  <BlogPostBody body={destination.intro} title={destination.title} />
                </div>
              ) : destination.excerpt ? (
                <p className={`max-w-3xl text-lg leading-8 ${styles.muted}`}>{destination.excerpt}</p>
              ) : null}

              {hasQuickFacts(destination.quickFacts) ? (
                <DestinationQuickFacts facts={destination.quickFacts} />
              ) : null}

              {destination.highlights.length > 0 ? (
                <section aria-labelledby="highlights-heading">
                  <DestinationSectionHeading
                    id="highlights-heading"
                    eyebrow="Highlights"
                    title={`Top things to see in ${destination.title}`}
                  />
                  <DestinationHighlights highlights={destination.highlights} />
                </section>
              ) : null}

              {destination.body.length > 0 ? (
                <div className="max-w-3xl">
                  <BlogPostBody body={destination.body} title={destination.title} />
                </div>
              ) : null}

              {itineraries.length > 0 ? (
                <section aria-labelledby="itineraries-heading">
                  <DestinationSectionHeading
                    id="itineraries-heading"
                    eyebrow="Plan your days"
                    title="Sample itineraries"
                  />
                  <DestinationItineraries itineraries={itineraries} />
                </section>
              ) : null}

              {destination.tours.length > 0 ? (
                <section aria-labelledby="tours-heading">
                  <DestinationSectionHeading
                    id="tours-heading"
                    eyebrow="Private tours"
                    title={`Tours to ${destination.title}`}
                  />
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {destination.tours.map((tour) => (
                      <TourCard key={tour._id} tour={tour} />
                    ))}
                  </div>
                </section>
              ) : null}

              {destination.whereToStay.length > 0 ? (
                <section aria-labelledby="stay-heading" className="max-w-3xl">
                  <DestinationSectionHeading id="stay-heading" eyebrow="Accommodation" title="Where to stay" />
                  <BlogPostBody body={destination.whereToStay} title={destination.title} sponsoredLinks />
                </section>
              ) : null}

              {faqItems.length > 0 ? (
                <section aria-labelledby="faq-heading" className="max-w-3xl">
                  <DestinationSectionHeading id="faq-heading" eyebrow="Good to know" title="Frequently asked questions" />
                  <DestinationFAQ items={faqItems} />
                </section>
              ) : null}
            </div>

            <div className="mt-16">
              <BlogCTA
                postTitle={destination.title}
                sourceUrl={pageUrl}
                bookingLocation="destination_cta"
              />
            </div>
          </article>

          {guides.length > 0 ? (
            <section aria-labelledby="guides-heading" className="mt-16 sm:mt-20">
              <DestinationSectionHeading
                id="guides-heading"
                eyebrow="Travel guides"
                title={`${destination.title} guides`}
              />
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {guides.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          ) : null}

          {destination.relatedDestinations.length > 0 ? (
            <section aria-labelledby="related-destinations-heading" className="mt-16 sm:mt-20">
              <DestinationSectionHeading
                id="related-destinations-heading"
                eyebrow="Keep exploring"
                title="Related destinations"
              />
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {destination.relatedDestinations.map((related) => (
                  <DestinationCard key={related._id} destination={related} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
