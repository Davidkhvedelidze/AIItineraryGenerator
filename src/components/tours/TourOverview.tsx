import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "next-sanity";
import type { SanityImage } from "@/types/sanity-tour";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { normalizeExternalUrl } from "@/lib/utils";

type TourOverviewProps = {
  overview?: PortableTextBlock[];
};

function getSafePortableTextHref(value: unknown) {
  const href =
    typeof value === "object" &&
    value !== null &&
    "href" in value &&
    typeof value.href === "string"
      ? value.href.trim()
      : "";

  if (!href) return null;
  if (href.startsWith("/") || href.startsWith("#")) return href;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return href;

  return normalizeExternalUrl(href);
}

export function TourOverview({ overview }: TourOverviewProps) {
  if (!overview?.length) return null;

  return (
    <section id="overview" className="scroll-mt-24 space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Overview
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          What to expect
        </h2>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
        <PortableText
          value={overview}
          components={{
            block: {
              h2: ({ children }) => (
                <h3 className="pt-3 text-xl font-semibold tracking-tight text-foreground">
                  {children}
                </h3>
              ),
              h3: ({ children }) => (
                <h3 className="pt-2 text-lg font-semibold tracking-tight text-foreground">
                  {children}
                </h3>
              ),
              normal: ({ children }) => (
                <p className="mt-4 text-base leading-8 text-muted-foreground first:mt-0">
                  {children}
                </p>
              ),
            },
            list: {
              bullet: ({ children }) => (
                <ul className="my-4 list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
                  {children}
                </ul>
              ),
              number: ({ children }) => (
                <ol className="my-4 list-decimal space-y-2 pl-6 text-base leading-7 text-muted-foreground">
                  {children}
                </ol>
              ),
            },
            listItem: {
              bullet: ({ children }) => <li>{children}</li>,
              number: ({ children }) => <li>{children}</li>,
            },
            types: {
              image: ({ value }) => {
                const imageUrl = getSanityImageUrl(value as SanityImage, {
                  width: 1000,
                  fit: "max",
                });

                return imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={(value as SanityImage)?.alt || ""}
                    width={1000}
                    height={650}
                    sizes="(min-width: 1024px) 768px, calc(100vw - 32px)"
                    className="my-6 w-full rounded-2xl object-cover"
                  />
                ) : null;
              },
            },
            marks: {
              link: ({ children, value }) => {
                const href = getSafePortableTextHref(value);
                if (!href) return <>{children}</>;

                const isExternal = href.startsWith("http");
                return (
                  <a
                    href={href}
                    className="font-medium text-secondary-gold underline-offset-4 hover:text-amber-700 hover:underline"
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    target={isExternal ? "_blank" : undefined}
                  >
                    {children}
                  </a>
                );
              },
            },
          }}
        />
      </div>
    </section>
  );
}
