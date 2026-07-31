import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CarRentalWidget } from "@/components/itinerary/CarRentalWidget";
import { BookingSuggestion, ItineraryContent } from "@/components/itinerary/ItineraryContent";
import { EsimBanner } from "@/components/itinerary/EsimBanner";
import { InsuranceBanner } from "@/components/itinerary/InsuranceBanner";
import { ItineraryHero } from "@/components/itinerary/ItineraryHero";
import { TripStatsStrip } from "@/components/itinerary/TripStatsStrip";
import { WhatsAppFloatingButton } from "@/components/itinerary/WhatsAppFloatingButton";
import { CustomizeTripCta } from "@/components/gallery/CustomizeTripCta";
import {
  buildOvernightStayPlan,
  buildOvernightStayPlanFromAi,
} from "@/lib/itinerary/overnightStayPlan";
import { getSiteUrl } from "@/lib/site";
import { getAllTours } from "@/lib/tours";
import { getApprovedGalleryItinerary } from "@/lib/supabase/itineraryRequests";

type CommunityDetailPageProps = {
  params: { shortId: string };
};

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function generateMetadata({
  params,
}: CommunityDetailPageProps): Promise<Metadata> {
  const itinerary = await getApprovedGalleryItinerary(params.shortId);

  if (!itinerary) {
    return { title: "Trip Idea Not Found" };
  }

  const title = `${itinerary.shareTitle} | Community Trip Idea`;
  const description =
    cleanText(itinerary.result.overview) ||
    `A ${itinerary.tripLength}-day Georgia itinerary shared by a TripMate Georgia traveler.`;
  const imageUrl = `${getSiteUrl()}/logo.png`;
  const pageUrl = `${getSiteUrl()}/trip-ideas/community/${params.shortId}`;

  return {
    title,
    description,
    alternates: { canonical: `/trip-ideas/community/${params.shortId}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "TripMate Georgia" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const revalidate = 300;

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const itinerary = await getApprovedGalleryItinerary(params.shortId);
  if (!itinerary) notFound();

  const { result } = itinerary;
  const days = result.days ?? [];
  const tours = await getAllTours();
  const pageUrl = `${getSiteUrl()}/trip-ideas/community/${params.shortId}`;
  const aiOvernightStayPlan = result.overnightStayPlan;
  const overnightStayPlan =
    aiOvernightStayPlan && aiOvernightStayPlan.length > 0
      ? buildOvernightStayPlanFromAi(aiOvernightStayPlan, days.length)
      : buildOvernightStayPlan(days);
  const cost = cleanText(result.totalPrice) || cleanText(result.estimatedBudget);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <WhatsAppFloatingButton pageUrl={pageUrl} />
      <main className="flex-1">
        <ItineraryHero
          result={result}
          tripLength={itinerary.tripLength}
          pageUrl={pageUrl}
          badgeLabel="Community Trip Idea"
          heading={itinerary.shareTitle}
        />

        <TripStatsStrip
          tripLength={itinerary.tripLength}
          travelStyle={itinerary.travelStyle}
          cost={cost}
          costLabel={cleanText(result.totalPrice) ? "Total price" : "Estimated budget"}
        />

        <CustomizeTripCta className="py-8" />

        <ItineraryContent result={result} tours={tours} overnightStayPlan={overnightStayPlan} />

        <div className="container grid gap-6 border-t border-stone-200 py-12 sm:grid-cols-1 lg:grid-cols-3">
          <CarRentalWidget />
          <InsuranceBanner />
          <EsimBanner />
        </div>

        <BookingSuggestion text={result.bookingSuggestion} />

        <CustomizeTripCta className="pb-16" />
      </main>
      <Footer />
    </div>
  );
}
