"use client";

import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import Logo from "../../../public/logo.png";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/contact";

const navLinks = [
  {
    label: "Tours",
    href: "/tours",
  },
  {
    label: "Destinations",
    href: "/destinations",
  },
  {
    label: "Trip Ideas",
    href: "/trip-ideas",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

const plannerHref = "/#trip-planner";

const whatsappUrl = buildWhatsAppUrl();

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close the mobile menu on navigation and Escape; lock page scroll while it's open.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-background/90 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-full pr-2 transition-opacity hover:opacity-90"
          aria-label="TripMate Georgia home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-stone-200 transition-transform group-hover:scale-105">
            <Image
              src={Logo}
              alt="TripMate Georgia"
              className="h-9 w-9 object-contain"
              priority
            />
          </span>

          <span className="leading-tight">
            <span className="block font-serif text-base font-semibold tracking-normal text-foreground sm:text-lg">
              TripMate Georgia
            </span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block md:hidden lg:block">
              Local private trips, planned with care
            </span>
          </span>
        </Link>
        <div className="flex">
          <nav
            className="hidden items-center gap-1 p-1 md:flex"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors lg:px-4",
                    active
                      ? "bg-primary-soft text-foreground"
                      : "text-stone-700 hover:bg-primary-soft hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href={plannerHref}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-primary-soft lg:hidden"
            >
              Build itinerary
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={plannerHref}
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden gap-2 rounded-full bg-foreground px-4 text-background shadow-sm transition-all hover:-translate-y-0.5 hover:bg-foreground/90 lg:inline-flex",
              )}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Build itinerary
            </Link>
            <WhatsAppLink
              clickLocation="header"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "sm" }),
                "gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md",
              )}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Local help</span>
              <span className="sm:hidden">Help</span>
            </WhatsAppLink>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition-colors hover:bg-stone-50 md:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((value) => !value)}
            >
              {isOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-stone-200/80 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-xl md:hidden">
          <nav className="container grid gap-2" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary-soft text-foreground"
                      : "text-stone-700 hover:bg-white hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href={plannerHref}
              onClick={() => setIsOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Build itinerary
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
