import { MessageCircle } from "lucide-react";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";

export function BlogBookingLink({
  postTitle,
  postSlug,
  location = "blog_cta",
  className,
  label = "Book a tour on WhatsApp",
}: {
  postTitle?: string;
  postSlug?: string;
  location?: "blog_cta" | "blog_cover";
  className?: string;
  label?: string;
}) {
  const message =
    postTitle && postSlug
      ? `Hello! I’d like to book a private Georgia tour. I was reading "${postTitle}":\nhttps://tripmategeorgia.com/blog/${encodeURIComponent(postSlug)}\n\nCould you help with availability and pricing?`
      : "Hello! I’d like to book a private Georgia tour. Could you help me choose a route and confirm availability and pricing?";

  return (
    <WhatsAppLink
      clickLocation={location}
      href={`https://wa.me/995551181358?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      {label}
    </WhatsAppLink>
  );
}
