import { buttonVariants } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16">
      <div className="container rounded-xl border bg-card p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">Ready to build your Georgia itinerary?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Create a personalized plan in seconds and start traveling with confidence.</p>
        <a href="#trip-planner" className={`${buttonVariants({})} mt-6`}>
          Plan My Georgia Trip
        </a>
      </div>
    </section>
  );
}
