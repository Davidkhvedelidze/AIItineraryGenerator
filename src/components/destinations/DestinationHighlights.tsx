import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "@/components/blog/blog.module.css";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { DestinationHighlight } from "@/types/sanity-destination";

type HighlightLink = { href: string; external: boolean; label: string };

function getHighlightLink(highlight: DestinationHighlight): HighlightLink | null {
  if (highlight.post?.slug) {
    return { href: `/blog/${highlight.post.slug}`, external: false, label: "Read guide" };
  }

  const url = highlight.url?.trim();
  if (!url) return null;
  if (/^\/(?![\/\\])/.test(url)) return { href: url, external: false, label: "Learn more" };
  if (/^https?:\/\//i.test(url)) return { href: url, external: true, label: "Learn more" };
  return null;
}

export function DestinationHighlights({ highlights }: { highlights: DestinationHighlight[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {highlights.map((highlight) => {
        const link = getHighlightLink(highlight);
        const imageUrl = getSanityImageUrl(highlight.image, { width: 720, height: 450, fit: "crop" });

        return (
          <li key={highlight._key} className={styles.card}>
            {imageUrl ? (
              <div className={styles.cardImage}>
                <Image
                  src={imageUrl}
                  alt={highlight.image?.alt || highlight.name}
                  fill
                  sizes="(min-width: 1280px) 365px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, calc(100vw - 32px)"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className={`flex flex-1 flex-col ${imageUrl ? "pt-5" : ""}`}>
              <h3 className="font-serif text-[1.3rem] font-medium leading-snug">{highlight.name}</h3>
              {highlight.description ? (
                <p className={`mt-2 text-sm leading-6 ${styles.muted}`}>{highlight.description}</p>
              ) : null}
              {link ? (
                link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm font-semibold ${styles.accent}`}
                  >
                    {link.label} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    aria-label={`${link.label}: ${highlight.name}`}
                    className={`mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm font-semibold ${styles.accent}`}
                  >
                    {link.label} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
