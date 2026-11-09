import Link from "next/link";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
} from "@/lib/contact";

const footerLinks = [
  { label: "Build itinerary", href: "/#trip-planner" },
  { label: "Destinations", href: "/destinations" },
  { label: "Tours", href: "/tours" },
  { label: "Trip Ideas", href: "/trip-ideas" },
  { label: "Blog", href: "/blog" },
];

export function Footer() {
  return (
    <footer className="bg-foreground py-10 text-amber-50">
      <div className="container grid gap-6 text-sm text-amber-50/75 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="font-serif text-lg font-semibold text-white">
            TripMate Georgia by Must See Georgia
          </p>
          <p className="mt-1 max-w-md">
            Free AI itineraries for Georgia, with local private tours and
            WhatsApp support when you&apos;re ready to book.
          </p>
          <nav aria-label="Footer navigation" className="mt-3">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="inline-flex min-h-11 items-center hover:text-white"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <a
            className="inline-flex min-h-11 items-center hover:text-white"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
          <a
            className="inline-flex min-h-11 items-center hover:text-white"
            href={`tel:${CONTACT_PHONE}`}
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
        </div>
      </div>
      <div className="container mt-6 border-t border-white/10 pt-6 text-xs text-amber-50/60">
        © {new Date().getFullYear()} TripMate Georgia. Built for first-time
        visitors exploring Georgia.
      </div>
    </footer>
  );
}
