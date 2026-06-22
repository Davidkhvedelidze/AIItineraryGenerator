import Link from "next/link";
import type { BlogCTA as BlogCTAContent } from "@/types/sanity-blog";

type BlogCTAProps = {
  cta?: BlogCTAContent;
};

export function BlogCTA({ cta }: BlogCTAProps) {
  if (!cta || (!cta.title && !cta.description)) {
    return null;
  }

  const primaryButton =
    cta.primaryButtonLabel && cta.primaryButtonLink
      ? {
          label: cta.primaryButtonLabel,
          href: cta.primaryButtonLink,
        }
      : null;
  const secondaryButton =
    cta.secondaryButtonLabel && cta.secondaryButtonLink
      ? {
          label: cta.secondaryButtonLabel,
          href: cta.secondaryButtonLink,
        }
      : null;

  return (
    <section className="my-12 overflow-hidden rounded-3xl border border-[#E8C766]/60 bg-[linear-gradient(135deg,#FFFDF7_0%,#FFF3BF_55%,#F8D66D_100%)] p-6 shadow-[0_18px_50px_rgba(120,78,12,0.12)] md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {cta.title ? (
            <h2 className="text-2xl font-semibold tracking-tight text-[#1F1A12] md:text-3xl">
              {cta.title}
            </h2>
          ) : null}
          {cta.description ? (
            <p className="mt-3 text-base leading-7 text-[#4B3B18]">
              {cta.description}
            </p>
          ) : null}
        </div>
        {primaryButton || secondaryButton ? (
          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            {primaryButton ? (
              <Link
                href={primaryButton.href}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F5B700] px-5 py-2.5 text-sm font-semibold text-[#1F1A12] shadow-sm transition hover:bg-[#D99A00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A4E0C]"
              >
                {primaryButton.label}
              </Link>
            ) : null}
            {secondaryButton ? (
              <Link
                href={secondaryButton.href}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#D6B44B] bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#1F1A12] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A4E0C]"
              >
                {secondaryButton.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
