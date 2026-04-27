import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="border-b bg-gradient-to-b from-slate-50 to-background py-14">
      <div className="container grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Plan Your Perfect Trip to Georgia with AI</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Tell us your travel style, budget, and interests — get a personalized day-by-day itinerary in seconds.
          </p>
          <a href="#trip-planner" className={buttonVariants({ size: "lg" })}>
            Plan My Georgia Trip
          </a>
        </div>
        <div className="overflow-hidden rounded-xl border shadow-md">
          <Image src="/georgia-hero.svg" alt="Mountain landscape illustration for Georgia travel" width={1200} height={800} priority className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
