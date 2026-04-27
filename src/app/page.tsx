import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CTASection } from "@/components/home/CTASection";
import { ExampleItinerary } from "@/components/home/ExampleItinerary";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TripPlanner } from "@/components/trip-planner/TripPlanner";

export default function HomePage() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
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
