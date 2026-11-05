import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "@/components/blog/blog.module.css";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { DestinationListItem } from "@/types/sanity-destination";

function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function DestinationCard({
  destination,
  headingLevel = "h3",
}: {
  destination: DestinationListItem;
  headingLevel?: "h2" | "h3";
}) {
  const href = `/destinations/${destination.slug}`;
  const imageUrl = getSanityImageUrl(destination.heroImage, { width: 720, height: 450, fit: "crop" });
  const Heading = headingLevel;
  const counts = [
    destination.guideCount > 0 ? pluralize(destination.guideCount, "guide") : null,
    destination.tourCount > 0 ? pluralize(destination.tourCount, "tour") : null,
  ].filter(Boolean);

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.cardImage} tabIndex={-1} aria-hidden="true">
        <Image
          src={imageUrl || "/tbilisiHD.jpg"}
          alt={imageUrl ? destination.heroImage?.alt || destination.title : ""}
          fill
          sizes="(min-width: 1280px) 365px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, calc(100vw - 32px)"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <Heading className="font-serif text-[1.4rem] font-medium leading-snug">
          <Link href={href} className={styles.cardTitle}>
            {destination.title}
          </Link>
        </Heading>
        {destination.excerpt ? (
          <p className={`mt-3 line-clamp-3 text-sm leading-6 ${styles.muted}`}>{destination.excerpt}</p>
        ) : null}
        <div className={`mt-auto flex items-center justify-between gap-4 pt-6 text-xs ${styles.muted}`}>
          <span>{counts.length > 0 ? counts.join(" · ") : "Travel guide"}</span>
          <Link
            href={href}
            aria-label={`Explore ${destination.title}`}
            className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold ${styles.accent}`}
          >
            Explore <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
