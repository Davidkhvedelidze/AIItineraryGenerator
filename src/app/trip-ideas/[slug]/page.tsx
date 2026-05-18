import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FAQSection } from "@/components/seo/FAQSection";
import { SeoCTA } from "@/components/seo/SeoCTA";
import { popularTripIdeas } from "@/constants/popular-trip-ideas";
import { buildFAQJsonLd } from "@/lib/seo/faqJsonLd";

interface TripIdeaDetailPageProps {
  params: Promise<{ slug: string }>;
}

function getTripIdeaBySlug(slug: string) {
  return popularTripIdeas.find((idea) => idea.slug === slug);
}

export function generateStaticParams(): { slug: string }[] {
  return popularTripIdeas.map((idea) => ({ slug: idea.slug }));
}

export async function generateMetadata({ params }: TripIdeaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const idea = getTripIdeaBySlug(slug);

  if (!idea) {
    return {
      title: "Trip idea not found",
      description: "The requested trip idea could not be found.",
    };
  }

  return {
    title: idea.metaTitle,
    description: idea.metaDescription,
    alternates: {
      canonical: `/trip-ideas/${idea.slug}`,
    },
  };
}

export default async function TripIdeaDetailPage({ params }: TripIdeaDetailPageProps) {
  const { slug } = await params;
  const idea = getTripIdeaBySlug(slug);

  if (!idea) {
    notFound();
  }

  const faqJsonLd = idea.faq ? buildFAQJsonLd(idea.faq) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-4">
        <article className="mx-auto max-w-4xl space-y-8">
          {faqJsonLd ? (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
          ) : null}
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{idea.duration}</p>
            <h1 className="text-4xl font-semibold tracking-tight">{idea.title}</h1>
            <p className="text-muted-foreground">{idea.description}</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Route:</span> {idea.startingPoint} → {idea.endingPoint}
            </p>
          </header>

          <section>
            <h2 className="text-2xl font-semibold">Highlights</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              {idea.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Itinerary</h2>
            <ol className="mt-4 space-y-3">
              {idea.itinerary.map((day) => (
                <li key={day.day} className="rounded-lg border p-4">
                  <p className="text-sm font-semibold text-amber-700">{day.day}</p>
                  <h3 className="mt-1 text-lg font-semibold">{day.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{day.details}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Travel Tips</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              {idea.travelTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Best time to visit:</span> {idea.bestTimeToVisit}
            </p>
          </section>

          {idea.faq ? <FAQSection items={idea.faq} /> : null}

          <SeoCTA />
        </article>
      </main>
      <Footer />
    </div>
  );
}
