import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogCTA as BlogCTAContent } from "@/types/sanity-blog";
import styles from "./blog.module.css";

const defaultCTA: BlogCTAContent = {
  title: "Make it your Georgia story.",
  description:
    "Take the places you’ve been reading about and explore them with a local. Find a private tour that fits your pace.",
  primaryButtonLabel: "Explore private tours",
  primaryButtonLink: "/tours",
  secondaryButtonLabel: "Browse trip ideas",
  secondaryButtonLink: "/trip-ideas",
};

export function BlogCTA({ cta }: { cta?: BlogCTAContent }) {
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
        <div className="mt-6 flex flex-wrap gap-3">
          {content.primaryButtonLabel && content.primaryButtonLink ? (
            <Link
              href={content.primaryButtonLink}
              className={styles.primaryButton}
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
