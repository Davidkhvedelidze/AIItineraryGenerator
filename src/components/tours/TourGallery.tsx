"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { SanityImage } from "@/types/sanity-tour";
import { getSanityImageUrl, hasSanityImage } from "@/lib/sanity/image";

type TourGalleryProps = {
  mainImage?: SanityImage;
  images?: SanityImage[];
  title: string;
};

export function TourGallery({ mainImage, images, title }: TourGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const seen = new Set<string>();
  const gallery = [mainImage, ...(images ?? [])]
    .filter(hasSanityImage)
    .filter((image) => {
      const ref = image.asset?._ref;
      if (!ref || seen.has(ref)) return false;
      seen.add(ref);
      return true;
    });

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeIndex]);

  if (gallery.length === 0) return null;

  return (
    <section
      id="gallery"
      aria-labelledby="tour-gallery-heading"
      className="scroll-mt-24 gap-y-4 flex flex-col"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Visual preview
          </p>
          <h2
            id="tour-gallery-heading"
            className="mt-1 text-2xl font-semibold tracking-tight"
          >
            Gallery
          </h2>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">
          {gallery.length} image{gallery.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.slice(0, 5).map((image, index) => {
          const imageUrl = getSanityImageUrl(image, {
            width: index === 0 ? 1100 : 640,
            height: index === 0 ? 760 : 480,
            fit: "crop",
          });
          if (!imageUrl) return null;
          return (
            <button
              type="button"
              key={image.asset?._ref || `${title}-${index}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Open image ${index + 1} of ${gallery.length}`}
              className={
                index === 0
                  ? "overflow-hidden rounded-2xl border bg-muted shadow-sm sm:col-span-2 lg:row-span-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                  : "overflow-hidden rounded-2xl border bg-muted shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              }
            >
              <Image
                src={imageUrl}
                alt={image.alt || `${title} gallery image ${index + 1}`}
                width={index === 0 ? 1100 : 640}
                height={index === 0 ? 760 : 480}
                sizes={
                  index === 0
                    ? "(min-width: 1024px) 576px, (min-width: 640px) 50vw, calc(100vw - 32px)"
                    : "(min-width: 1024px) 288px, (min-width: 640px) 50vw, calc(100vw - 32px)"
                }
                className={
                  index === 0
                    ? "aspect-[4/3] h-full w-full object-cover"
                    : "aspect-[4/3] w-full object-cover"
                }
              />
            </button>
          );
        })}
      </div>
      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          className="fixed inset-0 z-[999] h-ull flex items-center bg-black/50 px-4 py-14 text-white"
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-6 w-6" />
          </button>
          <Swiper
            modules={[Navigation, Pagination, Keyboard]}
            initialSlide={activeIndex}
            navigation={gallery.length > 1}
            pagination={gallery.length > 1 ? { clickable: true } : false}
            keyboard={{ enabled: true }}
            className="tour-gallery-swiper w-full max-w-6xl"
          >
            {gallery.map((image, index) => {
              const imageUrl = getSanityImageUrl(image, {
                width: 1800,
                height: 1200,
                fit: "max",
              });
              if (!imageUrl) return null;
              return (
                <SwiperSlide key={image.asset?._ref || `${title}-${index}`}>
                  <div className="flex h-[75vh] items-center justify-center pb-8">
                    <Image
                      src={imageUrl}
                      alt={image.alt || `${title} gallery image ${index + 1}`}
                      width={1800}
                      height={1200}
                      sizes="100vw"
                      className="max-h-full w-auto max-w-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </section>
  );
}
