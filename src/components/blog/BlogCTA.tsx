import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogBookingLink } from "./BlogBookingLink";
import type { BlogCTA as BlogCTAContent } from "@/types/sanity-blog";
import styles from "./blog.module.css";

const defaultCTA: BlogCTAContent = {
  title: "Ready to book a private Georgia tour?",
  description:
    "Message us on WhatsApp with your travel dates and group size. We’ll help you choose a route and confirm availability and pricing.",
  primaryButtonLabel: "Explore private tours",
  primaryButtonLink: "/tours",
};

export function BlogCTA({
  cta,
  postTitle,
  postSlug,
  sourceUrl,
  bookingLocation = "blog_cta",
}: {
  cta?: BlogCTAContent;
  postTitle?: string;
  postSlug?: string;
  sourceUrl?: string;
  bookingLocation?: "blog_cta" | "destination_cta";
}) {
  const content = cta && (cta.title || cta.description) ? cta : defaultCTA;
  return (
    <section
      className={`grid overflow-hidden rounded-2xl border md:grid-cols-[1fr_240px] ${styles.border} ${styles.soft}`}
    >
      <div className="p-7 sm:p-10">
        {content.title ? (
          <h2 className="max-w-xl font-serif text-3xl font-medium leading-tight sm:text-4xl">
            {content.title}
          </h2>
        ) : null}
        {content.description ? (
          <p className={`mt-4 max-w-xl text-base leading-7 ${styles.muted}`}>
            {content.description}
          </p>
        ) : null}
        {content !== defaultCTA ? (
          <p className={`mt-4 max-w-xl text-sm leading-6 ${styles.muted}`}>
            Ready to book a private tour? Message us on WhatsApp with your
            travel dates and group size for availability and pricing.
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <BlogBookingLink
            postTitle={postTitle}
            postSlug={postSlug}
            sourceUrl={sourceUrl}
            location={bookingLocation}
            className={styles.primaryButton}
          />
          {content.primaryButtonLabel && content.primaryButtonLink ? (
            <Link
              href={content.primaryButtonLink}
              className={styles.secondaryButton}
            >
              {content.primaryButtonLabel}
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          ) : null}
          {content.secondaryButtonLabel && content.secondaryButtonLink ? (
            <Link
              href={content.secondaryButtonLink}
              className={styles.secondaryButton}
            >
              {content.secondaryButtonLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
