"use client";

import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { buttonVariants } from "@/components/ui/button";

const trustSignals = [
  "Realistic Georgia routes",
  "Food and transport notes",
  "Optional local booking help",
];

const routeHighlights = [
  { label: "Tbilisi", value: "Old Town, food, culture" },
  { label: "Kakheti", value: "Wine routes and hill towns" },
  { label: "Kazbegi", value: "Mountain viewpoints" },
];

const heroSlides = [
  {
    title: "Kazbegi",
    subtitle: "Gergeti Trinity Church and Mount Kazbek",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kazbegi%2C%20Gergeti%20Trinity%20Church%20and%20Mt%20Kazbek%20%2835959311351%29.jpg",
  },
  {
    title: "Tbilisi",
    subtitle: "Old Town balconies, hills, and historic streets",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Tbilisi_at_night%2C_Kura%2C_Georgia.jpg/960px-Tbilisi_at_night%2C_Kura%2C_Georgia.jpg",
  },
  {
    title: "Batumi",
    subtitle: "Black Sea skyline and seaside boulevard",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Batumi_sunset.jpg/960px-Batumi_sunset.jpg",
  },
  {
    title: "Uplistsikhe",
    subtitle: "Ancient rock-hewn town with cave dwellings",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Uplistsikhe_view.jpg/960px-Uplistsikhe_view.jpg",
  },
  {
    title: "Svaneti",
    subtitle: "Medieval towers and alpine landscapes",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Mestia%2C_evening.jpg/960px-Mestia%2C_evening.jpg",
  },
  {
    title: "Mtskheta",
    subtitle: "UNESCO site with ancient churches and monasteries",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Mtskheta_and_Svetitskhoveli_Cathedral_16x9.jpg/960px-Mtskheta_and_Svetitskhoveli_Cathedral_16x9.jpg",
  },
];

export function HeroSection() {
  return (
    <section className="border-b bg-[linear-gradient(180deg,hsl(146_48%_96%)_0%,hsl(140_36%_92%)_100%)]">
      <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,1fr)]">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/20 bg-white/75 px-3 py-1 text-sm font-medium text-emerald-900 shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            AI itinerary planner with local Georgia booking support
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Plan a realistic Georgia trip in minutes
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Build a day-by-day route for Tbilisi, Kakheti, Kazbegi, Batumi,
              Svaneti, and more. Get practical food, timing, and transport notes
              before you ask a local expert to help with booking.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#trip-planner"
              className={`${buttonVariants({ size: "lg" })} gap-2`}
            >
              Generate My Itinerary
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://wa.me/995551181358?text=Hello%2C%20I%20would%20like%20help%20planning%20my%20Georgia%20trip."
              className={`${buttonVariants({ variant: "outline", size: "lg" })} gap-2 bg-white/80`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Talk to a Local Expert
            </a>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {trustSignals.map((signal) => (
              <div key={signal} className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border bg-white shadow-xl shadow-emerald-950/15">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            loop
            speed={900}
            autoplay={{ delay: 3800, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="h-[430px] sm:h-[520px]"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.title}>
                <div
                  className="relative h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${slide.image}")` }}
                  role="img"
                  aria-label={`${slide.title}, Georgia - ${slide.subtitle}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/78 via-emerald-950/12 to-white/5" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-md bg-white/75 p-5 shadow-xl backdrop-blur ">
                    <p className="text-sm font-medium text-primary">
                      Georgia route preview
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">
                      {slide.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {slide.subtitle}
                    </p>
                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                      {routeHighlights.map((item) => (
                        <div key={item.label}>
                          <p className="font-semibold text-foreground">
                            {item.label}
                          </p>
                          <p className="text-muted-foreground">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
