import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CTASection } from "@/components/home/CTASection";
import { ExampleItinerary } from "@/components/home/ExampleItinerary";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularTripIdeas } from "@/components/home/PopularTripIdeas";
import { TripPlanner } from "@/components/trip-planner/TripPlanner";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "WebApplication"],
  name: "TripMate Georgia",
  applicationCategory: "TravelApplication",
  operatingSystem: "Any",
  description:
    "AI-powered Georgia travel itinerary planner for realistic day-by-day routes, local food suggestions, transport tips, and booking help.",
  url: siteUrl,
  email: "info@mustseegeorgia.com",
  telephone: "+995551181358",
  areaServed: {
    "@type": "Country",
    name: "Georgia",
  },
  serviceType: "Georgia travel itinerary planning and tour booking help",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free AI-generated Georgia itinerary preview with optional local booking support.",
  },
  keywords:
    "Georgia itinerary planner, free Georgia itinerary planner, create Georgia itinerary for free, free AI Georgia itinerary, AI Georgia travel planner, Tbilisi itinerary, Kazbegi tour route, Kakheti wine trip, Batumi travel plan, Georgia booking help",
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
        <PopularTripIdeas />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
