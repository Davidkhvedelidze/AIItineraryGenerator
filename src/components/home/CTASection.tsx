import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { buildWhatsAppUrl } from "@/lib/contact";

const whatsappUrl = buildWhatsAppUrl();

export function CTASection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <ScrollReveal className="overflow-hidden rounded-2xl text-stone-950 shadow-xl shadow-yellow-900/10">
          <div className="grid gap-8 bg-primary p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/25 px-3 py-1 text-sm font-semibold text-stone-950">
                <ShieldCheck
                  className="h-4 w-4 text-stone-950"
                  aria-hidden="true"
                />
                Local support after the itinerary
              </div>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Plan the route now. Make it real with a private Georgia team.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-950 sm:text-base">
                Generate a custom itinerary, browse private tours, or message a
                local expert for help with pickup, route details, timing, and
                travel pace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="/#trip-planner"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background shadow-sm transition hover:-translate-y-0.5 hover:bg-foreground/90"
              >
                Generate Custom Itinerary
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href="/tours"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/20 bg-white/20 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white/35"
              >
                Browse Tours
              </Link>
              <WhatsAppLink clickLocation="home_cta"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/20 bg-white/20 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white/35"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Local Help
              </WhatsAppLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
