"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";

import Logo from "../../../public/logo.png";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "Tours",
    href: "/tours",
  },
  {
    label: "Trip Ideas",
    href: "/trip-ideas",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Build itinerary",
    href: "/#trip-planner",
  },
];

const whatsappUrl =
  "https://wa.me/995551181358?text=Hello%2C%20I%20would%20like%20help%20planning%20my%20Georgia%20trip.";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-background/90 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
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
            <span className="hidden text-xs font-medium text-stone-600 sm:block">
              Local private trips, planned with care
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-stone-200/80 bg-white/75 p-1 shadow-sm md:flex"
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
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-soft text-foreground"
                    : "text-stone-700 hover:bg-primary-soft hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
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
          </a>

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
          </nav>
        </div>
      ) : null}
    </header>
  );
}
