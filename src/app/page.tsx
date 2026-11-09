import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CTASection } from "@/components/home/CTASection";
import { ExampleItinerary } from "@/components/home/ExampleItinerary";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularTripIdeas } from "@/components/home/PopularTripIdeas";
import { getSiteUrl } from "@/lib/site";
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_PROFILE_URL } from "@/lib/contact";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    absolute: "TripMate Georgia: Free AI Itinerary Planner & Private Tours",
  },
  description:
    "Free AI itinerary planner for Georgia — Tbilisi, Kazbegi, Kakheti, Svaneti & more. Get a custom day-by-day route in minutes, then book private tours with hotel pickup.",
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": `${siteUrl}/#organization`,
      name: "TripMate Georgia",
      url: siteUrl,
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      logo: `${siteUrl}/logo.png`,
      areaServed: {
        "@type": "Country",
        name: "Georgia",
      },
      sameAs: [
        "https://www.viator.com/Tbilisi-tours/d22516-ttd",
        WHATSAPP_PROFILE_URL,
        // + Instagram/Facebook/TripAdvisor if you have them
      ],
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "TripMate Georgia Itinerary Planner",
      url: siteUrl,
      applicationCategory: "TravelApplication",
      operatingSystem: "Any",
      description:
        "AI-powered Georgia travel itinerary planner for realistic day-by-day routes, local food suggestions, transport tips, and booking help.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description:
          "Free AI-generated Georgia itinerary preview with optional local booking support.",
      },
      provider: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "TripMate Georgia",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function HomePage() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main className="flex-1 scroll-smooth">
        <HeroSection />
        <ExampleItinerary />
        <HowItWorks />
        <PopularTripIdeas />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
