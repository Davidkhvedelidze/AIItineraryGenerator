import { ExternalLink, Star } from "lucide-react";
import type { TourReview } from "@/types/sanity-tour";
import { normalizeExternalUrl } from "@/lib/utils";

type TourReviewsProps = {
  reviews?: TourReview[];
  tripadvisorUrl?: string;
};

export function TourReviews({ reviews, tripadvisorUrl }: TourReviewsProps) {
  const items = reviews?.filter((review) => review.reviewerName || review.text) ?? [];
  const safeTripadvisorUrl = normalizeExternalUrl(tripadvisorUrl);

  if (items.length === 0) {
    if (!safeTripadvisorUrl) return null;

    return (
      <section
        id="reviews"
        aria-labelledby="tour-reviews-heading"
        className="scroll-mt-24 space-y-4"
      >
        <h2 id="tour-reviews-heading" className="text-2xl font-semibold tracking-tight">
          Traveler reviews
        </h2>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm leading-6 text-muted-foreground">
            Traveler reviews are not published on this page yet. You can compare
            live traveler feedback and booking details on TripAdvisor.
          </p>
          <a
            href={safeTripadvisorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Check TripAdvisor
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      id="reviews"
      aria-labelledby="tour-reviews-heading"
      className="scroll-mt-24 space-y-4"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Social proof
        </p>
        <h2 id="tour-reviews-heading" className="mt-1 text-2xl font-semibold tracking-tight">
          Traveler reviews
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((review, index) => {
          const reviewDate = review.reviewDate ? new Date(review.reviewDate) : null;
          const date =
            reviewDate && !Number.isNaN(reviewDate.getTime())
              ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(reviewDate)
              : null;
          const rating =
            typeof review.rating === "number"
              ? Math.min(5, Math.max(0, Math.round(review.rating)))
              : null;

          return (
            <article
              key={`${review.reviewerName || "review"}-${index}`}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              {rating ? (
                <div className="flex gap-1 text-primary" aria-label={`${rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={
                        starIndex < rating
                          ? "h-4 w-4 fill-primary"
                          : "h-4 w-4 text-muted-foreground/35"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
              ) : null}
              {review.text ? (
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{review.text}</p>
              ) : null}
              <footer className="mt-4 text-sm">
                <p className="font-semibold text-foreground">
                  {review.reviewerName || "Traveler"}
                  {review.country ? (
                    <span className="font-normal text-muted-foreground"> · {review.country}</span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {review.source ? `Source: ${review.source}` : null}
                  {review.source && date ? " · " : ""}
                  {date}
                </p>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
