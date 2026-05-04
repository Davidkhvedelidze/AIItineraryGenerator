import { buttonVariants } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="rounded-lg border bg-emerald-800 p-8 text-white shadow-lg shadow-emerald-950/20 sm:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to turn your Georgia ideas into a real route?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-emerald-50">
              Generate a free itinerary preview, then use WhatsApp or email if
              you want local help with transport, guides, hotels, or day trips.
            </p>
            <a
              href="#trip-planner"
              className={`${buttonVariants({ variant: "inverse" })} mt-6`}
            >
              Build My Georgia Itinerary
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
