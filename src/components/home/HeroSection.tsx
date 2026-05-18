import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  MapPin,
  MessageCircle,
  Plane,
  Route,
  ShieldCheck,
  Users,
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/995551181358?text=Hello%2C%20I%20would%20like%20help%20planning%20my%20Georgia%20trip.";

const heroImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Kazbegi%2C_Gergeti_Trinity_Church_and_Mt_Kazbek_%2835959311351%29.jpg/1280px-Kazbegi%2C_Gergeti_Trinity_Church_and_Mt_Kazbek_%2835959311351%29.jpg";

const trustBadges = [
  "Private driver support",
  "Family-friendly pacing",
  "GCC traveler guidance",
  "Flexible pickup",
  "Local route checks",
];

const heroStats = [
  {
    label: "Route style",
    value: "AI plan refined by local Georgia support",
    icon: Route,
  },
  {
    label: "Best for",
    value: "Families, first-time visitors, private groups",
    icon: Users,
  },
  {
    label: "Comfort layer",
    value: "Pickup, timing, food stops, and driver notes",
    icon: ShieldCheck,
  },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-amber-950 text-white">
      <Image
        src={heroImage}
        alt="Gergeti Trinity Church and Mount Kazbek in Kazbegi, Georgia"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(69,26,3,0.34)_0%,rgba(120,53,15,0.22)_26%,rgba(146,64,14,0.14)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-amber-950/95 to-transparent" />
      <div className="container relative py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1 text-sm font-semibold text-amber-50 shadow-sm backdrop-blur">
            <Plane className="h-4 w-4 text-amber-200" aria-hidden="true" />
            Georgia travel concierge for realistic private trips
          </div>

          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
            A Georgia trip plan that feels local from day one
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-amber-50 sm:text-lg">
            Use AI to shape a practical Georgia itinerary, then turn it into a
            comfortable private trip with local help for pickup, mountain roads,
            family pacing, food stops, and booking details.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#trip-planner"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl"
            >
              Generate Custom Itinerary
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/tours"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/12 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18"
            >
              Browse Private Tours
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-amber-950/20 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-amber-950/30"
            >
              <MessageCircle
                className="h-4 w-4 text-amber-200"
                aria-hidden="true"
              />
              Local Help
            </a>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold text-amber-50 backdrop-blur"
              >
                <BadgeCheck
                  className="h-3.5 w-3.5 text-amber-200"
                  aria-hidden="true"
                />
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid max-w-5xl gap-3 sm:grid-cols-3">
          {heroStats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-white/18 bg-white/12 p-4 shadow-lg shadow-amber-950/20 backdrop-blur"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-white">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex max-w-5xl flex-col gap-3 rounded-2xl border border-white/16 bg-amber-950/36 p-4 text-sm leading-6 text-amber-50 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 font-semibold text-white">
            <CalendarDays
              className="h-4 w-4 text-amber-200"
              aria-hidden="true"
            />
            Start with dates and interests.
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-200" aria-hidden="true" />
            Leave with a route that can become a real private tour.
          </span>
        </div>
      </div>
    </section>
  );
}
