"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
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
    <section className="relative isolate overflow-hidden bg-black text-white min-h-[calc(100dvh-65px)]">
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
        className="container relative py-14 sm:py-16 md:py-20 lg:py-24  min-h-[calc(100dvh-65px)] flex flex-col md:items-end md:justify-end"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="md:max-w-[664px] ">
          <motion.h1
            variants={fadeUp}
            className=" max-w-2xl font-serif text-5xl font-semibold leading-[0.98] md:text-end tracking-normal text-white sm:text-6xl md:text-7xl"
          >
            Your Georgia trip, planned in 60 seconds
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-8 text-end ml-auto text-amber-50 sm:text-lg"
          >
            Dates, interests, group size — in. A realistic day-by-day route —
            out: real driving times, food stops, sane pacing. Then our local
            team turns it into a bookable private trip.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:justify-end"
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

          <motion.div
            variants={fadeUp}
            className="mt-7  flex-wrap gap-2 hidden"
          >
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

        <motion.div
          variants={fadeUp}
          className="mt-12 grid max-w-5xl gap-3 sm:grid-cols-3"
        >
          {heroStats?.map((stat) => {
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
      </motion.div>
    </section>
  );
}
