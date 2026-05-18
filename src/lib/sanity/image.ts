import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";
import type { SanityImage } from "@/types/sanity-tour";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0]);
}

type SanityImageUrlOptions = {
  width?: number;
  height?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
};

export function hasSanityImage(source?: SanityImage | null): source is SanityImage {
  return Boolean(source?.asset?._ref);
}

export function getSanityImageUrl(
  source?: SanityImage | null,
  options: SanityImageUrlOptions = {},
) {
  if (!hasSanityImage(source)) return null;

  try {
    let image = urlFor(source).auto("format");

    if (options.width) image = image.width(options.width);
    if (options.height) image = image.height(options.height);
    if (options.fit) image = image.fit(options.fit);

    return image.url();
  } catch {
    return null;
  }
}
