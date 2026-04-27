import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CTASection } from "@/components/home/CTASection";
import { ExampleItinerary } from "@/components/home/ExampleItinerary";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TripPlanner } from "@/components/trip-planner/TripPlanner";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "TripMate Georgia",
  description:
    "AI-powered Georgia travel itinerary planner for personalized day-by-day trips, local food suggestions, transport tips, and booking help.",
  url: siteUrl,
  email: "info@mustseegeorgia.com",
  telephone: "+995551181358",
  areaServed: {
    "@type": "Country",
    name: "Georgia",
  },
  serviceType: "Georgia travel itinerary planning and tour booking help",
  keywords:
    "Georgia travel planner, AI itinerary generator, personalized trip planning, Georgia tours, local food recommendations, transport tips, booking assistance",
};

export default function HomePage() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TripPlanner />
        <ExampleItinerary />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
