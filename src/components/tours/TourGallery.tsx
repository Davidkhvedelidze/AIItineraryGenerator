import Image from "next/image";
import type { SanityImage } from "@/types/sanity-tour";
import { getSanityImageUrl, hasSanityImage } from "@/lib/sanity/image";

type TourGalleryProps = {
  mainImage?: SanityImage;
  images?: SanityImage[];
  title: string;
};

export function TourGallery({ mainImage, images, title }: TourGalleryProps) {
  const seen = new Set<string>();
  const gallery = [mainImage, ...(images ?? [])]
    .filter(hasSanityImage)
    .filter((image) => {
      const ref = image.asset?._ref;
      if (!ref || seen.has(ref)) return false;
      seen.add(ref);
      return true;
    })
    .slice(0, 6);

  if (gallery.length === 0) return null;

  return (
    <section
      id="gallery"
      aria-labelledby="tour-gallery-heading"
      className="scroll-mt-24 space-y-4"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Visual preview
          </p>
          <h2 id="tour-gallery-heading" className="mt-1 text-2xl font-semibold tracking-tight">
            Gallery
          </h2>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">
          {gallery.length} image{gallery.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.map((image, index) => {
          const imageUrl = getSanityImageUrl(image, {
            width: index === 0 ? 1100 : 640,
            height: index === 0 ? 760 : 480,
            fit: "crop",
          });

          if (!imageUrl) return null;

          return (
            <div
              key={image.asset?._ref || `${title}-${index}`}
              className={
                index === 0
                  ? "overflow-hidden rounded-2xl border bg-muted shadow-sm sm:col-span-2 lg:row-span-2"
                  : "overflow-hidden rounded-2xl border bg-muted shadow-sm"
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
