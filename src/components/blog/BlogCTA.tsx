import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
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
}: {
  cta?: BlogCTAContent;
  postTitle?: string;
  postSlug?: string;
}) {
  const content = cta && (cta.title || cta.description) ? cta : defaultCTA;
  const message =
    postTitle && postSlug
      ? `Hello! I’d like to book a private Georgia tour. I was reading "${postTitle}":\nhttps://tripmategeorgia.com/blog/${encodeURIComponent(postSlug)}\n\nCould you help with availability and pricing?`
      : "Hello! I’d like to book a private Georgia tour. Could you help me choose a route and confirm availability and pricing?";
  const whatsappUrl = `https://wa.me/995551181358?text=${encodeURIComponent(message)}`;
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
            Ready to book a private tour? Message us on WhatsApp with your travel
            dates and group size for availability and pricing.
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppLink
            clickLocation="blog_cta"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryButton}
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            Book a tour on WhatsApp
          </WhatsAppLink>
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
      <div className="relative hidden min-h-64 md:block">
        <Image
          src="/tbilisiHD.jpg"
          alt="Tbilisi’s historic cityscape"
          fill
          sizes="240px"
          className="object-cover"
        />
      </div>
    </section>
  );
}
