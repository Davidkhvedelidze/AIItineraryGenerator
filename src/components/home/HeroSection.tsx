"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  MapPin,
  MessageCircle,
  Route,
  ShieldCheck,
  Users,
} from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

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
    <section className="relative isolate overflow-hidden bg-black text-white">
      <Image
        src={heroImage}
        alt="Gergeti Trinity Church and Mount Kazbek in Kazbegi, Georgia"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-black/35" />
      <motion.div
        className="container relative py-14 sm:py-16 md:py-20 lg:py-24"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-3xl">
            <motion.h1
              variants={fadeUp}
              className=" max-w-2xl font-serif text-5xl font-semibold leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl"
            >
              Tell it your trip. Watch a real Georgia route take shape.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-8 text-amber-50 sm:text-lg"
            >
              Enter your dates, interests, and group size, and the planner
              drafts a day-by-day Georgia route in seconds, road logic, food
              stops, and pacing included. Local support turns it into a bookable
              private trip.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <a
                href="#trip-planner"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl"
              >
                Generate My Itinerary
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
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-black/20 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-black/30"
              >
                <MessageCircle
                  className="h-4 w-4 text-amber-200"
                  aria-hidden="true"
                />
                Local Help
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-2">
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
            </motion.div>
          </div>
          {/* <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/20 bg-black/40 p-5 shadow-2xl shadow-black/40 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
                </span>
                Live route preview
              </span>
              <span className="text-xs font-medium text-amber-100/80">
                4 days
              </span>
            </div>
            <RouteSignature className="mt-3 h-32 w-full" />
            <p className="mt-2 text-sm leading-6 text-amber-50/90">
              This is what the generator plots from a short prompt: real stops,
              in a sensible order, timed for how the roads actually drive.
            </p>
          </motion.div> */}
        </div>

        <motion.div
          variants={fadeUp}
          className="mt-12 grid max-w-5xl gap-3 sm:grid-cols-3"
        >
          {heroStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/18 bg-white/12 p-4 shadow-lg shadow-black/20 backdrop-blur"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {stat.label}
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-6 flex max-w-5xl flex-col gap-3 rounded-2xl border border-white/16 bg-black/35 p-4 text-sm leading-6 text-amber-50 backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        >
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
        </motion.div>
      </motion.div>
    </section>
  );
}
