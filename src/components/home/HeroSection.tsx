"use client";

import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { buttonVariants } from "@/components/ui/button";

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
    <section className="border-b bg-gradient-to-br from-emerald-50 via-lime-50 to-background py-14">
      <div className="container grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Plan Your Perfect Trip to Georgia with AI
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Tell us your travel style, budget, and interests — get a
            personalized day-by-day itinerary in seconds.
          </p>
          <a href="#trip-planner" className={buttonVariants({ size: "lg" })}>
            Plan My Georgia Trip
          </a>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white/70 shadow-lg shadow-emerald-900/10">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            loop
            speed={900}
            autoplay={{ delay: 3800, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="h-[320px] sm:h-[420px] lg:h-[480px]"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.title}>
                <div
                  className="relative h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${slide.image}")` }}
                  role="img"
                  aria-label={`${slide.title}, Georgia - ${slide.subtitle}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
                    <p className="text-2xl font-semibold">{slide.title}</p>
                    <p className="mt-1 max-w-md text-sm text-white/85">
                      {slide.subtitle}
                    </p>
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
