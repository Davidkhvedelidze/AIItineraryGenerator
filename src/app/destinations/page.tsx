import type { Metadata } from "next";
import Link from "next/link";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { DestinationBreadcrumb } from "@/components/destinations/DestinationBreadcrumb";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { DESTINATIONS_PAGE_COPY } from "@/constants/destinations";
import { getLiveDestinations } from "@/lib/destinations";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbJsonLd";
import { getSiteUrl } from "@/lib/site";
import styles from "@/components/blog/blog.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const destinations = await getLiveDestinations();
  const url = `${getSiteUrl()}/destinations`;
  const imageUrl = getSanityImageUrl(destinations[0]?.heroImage, { width: 1200, height: 630, fit: "crop" });

  return {
    title: DESTINATIONS_PAGE_COPY.metaTitle,
    description: DESTINATIONS_PAGE_COPY.metaDescription,
    alternates: { canonical: url },
    // Keep the hub out of the index until at least one destination is live.
    robots: destinations.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      title: DESTINATIONS_PAGE_COPY.metaTitle,
      description: DESTINATIONS_PAGE_COPY.metaDescription,
      type: "website",
      url,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: DESTINATIONS_PAGE_COPY.title }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: DESTINATIONS_PAGE_COPY.metaTitle,
      description: DESTINATIONS_PAGE_COPY.metaDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function DestinationsPage() {
  const destinations = await getLiveDestinations();
  const siteUrl = getSiteUrl();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Destinations", url: `${siteUrl}/destinations` },
  ]);
  const itemListJsonLd =
    destinations.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: DESTINATIONS_PAGE_COPY.title,
          itemListElement: destinations.map((destination, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}/destinations/${destination.slug}`,
            name: destination.title,
          })),
        }
      : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className={`flex-1 ${styles.journal}`}>
        <JsonLd data={breadcrumbJsonLd} />
        {itemListJsonLd ? <JsonLd data={itemListJsonLd} /> : null}

        <div className="container max-w-6xl pb-16 pt-6 sm:pb-20 sm:pt-8">
          <DestinationBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Destinations" }]} />

          <header className="mb-10 max-w-3xl sm:mb-14">
            <p className={`mb-4 text-xs font-semibold uppercase tracking-[.18em] ${styles.accent}`}>
              {DESTINATIONS_PAGE_COPY.eyebrow}
            </p>
            <h1 className="font-serif text-[2.75rem] font-medium leading-[1.1] tracking-tight sm:text-6xl">
              {DESTINATIONS_PAGE_COPY.title}
            </h1>
            {DESTINATIONS_PAGE_COPY.intro.map((paragraph) => (
              <p key={paragraph} className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg ${styles.muted}`}>
                {paragraph}
              </p>
            ))}
          </header>

          {destinations.length > 0 ? (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination) => (
                <DestinationCard key={destination._id} destination={destination} headingLevel="h2" />
              ))}
            </div>
          ) : (
            <section className={`rounded-2xl border p-8 sm:p-12 ${styles.border} ${styles.soft}`}>
              <h2 className="font-serif text-3xl">{DESTINATIONS_PAGE_COPY.emptyTitle}</h2>
              <p className={`mt-3 max-w-lg leading-7 ${styles.muted}`}>{DESTINATIONS_PAGE_COPY.emptyText}</p>
              <Link href="/blog" className={`mt-6 ${styles.secondaryButton}`}>
                Read the travel blog
              </Link>
            </section>
          )}

          <div className="mt-16 sm:mt-20">
            <BlogCTA />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
