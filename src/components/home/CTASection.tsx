import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";

const whatsappUrl =
  "https://wa.me/995551181358?text=Hello%2C%20I%20would%20like%20help%20planning%20my%20Georgia%20trip.";

export function CTASection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="overflow-hidden rounded-2xl text-amber-900 shadow-xl shadow-amber-950/20">
          <div className="grid gap-8 bg-[linear-gradient(135deg,#FFF7D6_0%,#F8D66D_45%,#F5B700_100%)] p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/40 bg-white/10 px-3 py-1 text-sm font-semibold text-amber-700">
                <ShieldCheck
                  className="h-4 w-4 text-amber-700"
                  aria-hidden="true"
                />
                Local support after the itinerary
              </div>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Plan the route now. Make it real with a private Georgia team.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-amber-900 sm:text-base">
                Generate a custom itinerary, browse private tours, or message a
                local expert for help with pickup, route details, timing, and
                travel pace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="#trip-planner"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                Generate Custom Itinerary
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href="/tours"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse Tours
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Local Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
