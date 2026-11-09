import { MessageCircle } from "lucide-react";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import { buildWhatsAppUrl } from "@/lib/contact";

export function BlogBookingLink({
  postTitle,
  postSlug,
  sourceUrl,
  location = "blog_cta",
  className,
  label = "Book a tour on WhatsApp",
}: {
  postTitle?: string;
  postSlug?: string;
  sourceUrl?: string;
  location?: "blog_cta" | "blog_cover" | "destination_cta" | "destination_cover";
  className?: string;
  label?: string;
}) {
  const linkedSource =
    sourceUrl ||
    (postSlug
      ? `https://tripmategeorgia.com/blog/${encodeURIComponent(postSlug)}`
      : null);
  const message =
    postTitle && linkedSource
      ? `Hello! I’d like to book a private Georgia tour. I was viewing "${postTitle}":\n${linkedSource}\n\nCould you help with availability and pricing?`
      : "Hello! I’d like to book a private Georgia tour. Could you help me choose a route and confirm availability and pricing?";

  return (
    <WhatsAppLink
      clickLocation={location}
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      {label}
    </WhatsAppLink>
  );
}
