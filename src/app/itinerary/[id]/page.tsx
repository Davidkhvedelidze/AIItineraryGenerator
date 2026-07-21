import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces } from "next/font/google";
import { BadgeCheck } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { DaySection } from "@/components/itinerary/DaySection";
import { InsuranceBanner } from "@/components/itinerary/InsuranceBanner";
import { ItineraryHero } from "@/components/itinerary/ItineraryHero";
import { getSiteUrl } from "@/lib/site";
import { getAllTours } from "@/lib/tours";
import { getItineraryRequestByShortId } from "@/lib/supabase/itineraryRequests";
import type { ItineraryResult, TripFormData } from "@/types/trip";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

type ItineraryPageProps = {
  params: { id: string };
};

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanList(items?: string[]): string[] {
  return items?.map(cleanText).filter(Boolean) ?? [];
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

function SummaryList({ title, items }: { title: string; items?: string[] }) {
  const visibleItems = cleanList(items);
  if (visibleItems.length === 0) return null;

  return (
    <div>
      <h4 className="font-[family-name:var(--font-fraunces)] text-sm font-semibold uppercase tracking-[0.1em] text-foreground">
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {visibleItems.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm leading-6 text-muted-foreground"
          >
            <BadgeCheck
              className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-700"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const stored = await getStoredItinerary(params.id);
  if (!stored) notFound();

  const { result, formData } = stored;
  const days = result.days ?? [];
  const tours = await getAllTours();
  const pageUrl = `${getSiteUrl()}/itinerary/${params.id}`;

  return (
    <div className={`flex min-h-screen flex-col ${fraunces.variable}`}>
      <Header />
      <main className="flex-1">
        <ItineraryHero
          result={result}
          formData={formData}
          days={days}
          pageUrl={pageUrl}
        />

        <div className="container">
          <div className="mx-auto ">
            <p className="mx-auto max-w-[68ch] pb-10 pt-6 text-center text-xs leading-5 text-muted-foreground">
              Some links on this page are affiliate links — they don&apos;t cost
              you anything and help keep the planner free.
            </p>

            {cleanText(result.overview) ? (
              <p className="mx-auto max-w-[68ch] pb-12 text-center font-[family-name:var(--font-fraunces)] text-xl italic leading-8 text-foreground/85 sm:text-2xl">
                &ldquo;{result.overview}&rdquo;
              </p>
            ) : null}

            {days.length > 0 ? (
              <div className=" space-y-8 md:space-y-14 pb-16">
                {days.map((day, index) => (
                  <DaySection
                    key={`${day.day}-${day.title}`}
                    day={day}
                    index={index}
                    isLast={index === days.length - 1}
                    tours={tours}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-stone-200 bg-white p-5 text-center text-sm leading-6 text-muted-foreground">
                This itinerary doesn&apos;t have a day-by-day plan yet.
              </div>
            )}

            <section className="border-t border-stone-200 pb-16 pt-12">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                Good to know
              </p>
              <h2 className="mt-2 text-center font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-foreground">
                Trip notes
              </h2>

              <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center">
                {cleanText(result.estimatedBudget) ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Estimated budget
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-foreground">
                      {result.estimatedBudget}
                    </p>
                  </div>
                ) : null}
                {cleanText(result.totalPrice) ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Total price
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-foreground">
                      {result.totalPrice}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mx-auto mt-10 grid max-w-2xl gap-8 sm:grid-cols-2 md:max-w-full lg:grid-cols-4">
                <SummaryList title="Best for" items={result.bestFor} />
                <SummaryList title="Included" items={result.includedServices} />
                <SummaryList
                  title="Not included"
                  items={result.notIncludedServices}
                />
                <SummaryList title="Packing tips" items={result.packingTips} />
                <SummaryList
                  title="Transport tips"
                  items={result.transportTips}
                />
                <SummaryList
                  title="Local food to try"
                  items={result.localFoodToTry}
                />
              </div>

              {cleanText(result.bookingSuggestion) ? (
                <p className="mx-auto mt-10 max-w-[60ch] text-center font-[family-name:var(--font-fraunces)] text-lg italic leading-8 text-foreground/80">
                  {result.bookingSuggestion}
                </p>
              ) : null}
            </section>
          </div>
        </div>

        <InsuranceBanner />
      </main>
      <Footer />
    </div>
  );
}
