import { buttonVariants } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16">
      <div className="container rounded-xl border bg-gradient-to-br from-emerald-700 to-lime-600 p-8 text-center text-white shadow-lg shadow-emerald-950/20">
        <h2 className="text-2xl font-semibold tracking-tight">Ready to build your Georgia itinerary?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-emerald-50">Create a personalized plan in seconds and start traveling with confidence.</p>
        <a href="#trip-planner" className={`${buttonVariants({})} mt-6 bg-white text-emerald-800 hover:bg-emerald-50`}>
          Plan My Georgia Trip
        </a>
      </div>
    </section>
  );
}
