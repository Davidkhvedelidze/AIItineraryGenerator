import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CarRentalWidget } from "@/components/itinerary/CarRentalWidget";
import { BookingSuggestion, ItineraryContent } from "@/components/itinerary/ItineraryContent";
import { EsimBanner } from "@/components/itinerary/EsimBanner";
import { InsuranceBanner } from "@/components/itinerary/InsuranceBanner";
import { ItineraryHero } from "@/components/itinerary/ItineraryHero";
import { ShareToGalleryButton } from "@/components/itinerary/ShareToGalleryButton";
import { TripStatsStrip } from "@/components/itinerary/TripStatsStrip";
import { WhatsAppFloatingButton } from "@/components/itinerary/WhatsAppFloatingButton";
import { generateShareTitle } from "@/lib/itinerary/generateShareTitle";
import { getSiteUrl } from "@/lib/site";
import { getAllTours } from "@/lib/tours";
import {
  buildOvernightStayPlan,
  buildOvernightStayPlanFromAi,
} from "@/lib/itinerary/overnightStayPlan";
import { getItineraryRequestByShortId } from "@/lib/supabase/itineraryRequests";
import type { ItineraryResult, TripFormData } from "@/types/trip";

type ItineraryPageProps = {
  params: { id: string };
};

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

async function getStoredItinerary(id: string) {
  const row = await getItineraryRequestByShortId(id);

  if (!row || row.status !== "success" || !row.itinerary_result) {
    return null;
  }

  return {
    result: row.itinerary_result as ItineraryResult,
    formData: row.form_data as TripFormData,
    days: row.form_data.days,
    sharingStatus: row.sharing_status,
  };
}

export async function generateMetadata({
  params,
}: ItineraryPageProps): Promise<Metadata> {
  const stored = await getStoredItinerary(params.id);

  if (!stored) {
    return { title: "Itinerary Not Found" };
  }

  const title = `My ${stored.days}-day Georgia itinerary`;
  const description =
    cleanText(stored.result.overview) ||
    "A custom Georgia trip itinerary built with TripMate Georgia's AI trip planner.";
  const imageUrl = `${getSiteUrl()}/logo.png`;
  const pageUrl = `${getSiteUrl()}/itinerary/${params.id}`;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: `/itinerary/${params.id}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: [
        { url: imageUrl, width: 1200, height: 630, alt: "TripMate Georgia" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const stored = await getStoredItinerary(params.id);
  if (!stored) notFound();

  const { result, formData, sharingStatus } = stored;
  const days = result.days ?? [];
  const tours = await getAllTours();
  const pageUrl = `${getSiteUrl()}/itinerary/${params.id}`;
  const aiOvernightStayPlan = result.overnightStayPlan;
  const overnightStayPlan =
    aiOvernightStayPlan && aiOvernightStayPlan.length > 0
      ? buildOvernightStayPlanFromAi(aiOvernightStayPlan, days.length)
      : buildOvernightStayPlan(days);
  const cost = cleanText(result.totalPrice) || cleanText(result.estimatedBudget);
  const suggestedShareTitle = generateShareTitle(formData.days, formData.interests, days);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <WhatsAppFloatingButton pageUrl={pageUrl} />
      <main className="flex-1">
        <ItineraryHero result={result} tripLength={formData.days} pageUrl={pageUrl} />

        <TripStatsStrip
          tripLength={formData.days}
          travelers={formData.travelers}
          travelStyle={formData.travelStyle}
          cost={cost}
          costLabel={cleanText(result.totalPrice) ? "Total price" : "Estimated budget"}
        />

        <div className="container flex justify-center py-6">
          <ShareToGalleryButton
            shortId={params.id}
            suggestedTitle={suggestedShareTitle}
            initialSharingStatus={sharingStatus}
          />
        </div>

        <ItineraryContent
          result={result}
          tours={tours}
          overnightStayPlan={overnightStayPlan}
          tripStartDateTime={formData.travelDates?.[0]}
          adults={formData.travelers}
        />

        <div className="container grid gap-6 border-t border-stone-200 py-12 sm:grid-cols-1 lg:grid-cols-3">
          <CarRentalWidget />
          <InsuranceBanner />
          <EsimBanner />
        </div>

        <BookingSuggestion text={result.bookingSuggestion} />
      </main>
      <Footer />
    </div>
  );
}
