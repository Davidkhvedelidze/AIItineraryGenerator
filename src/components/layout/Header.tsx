import { Compass, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <a
          href="#top"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base"
        >
          <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>TripMate Georgia</span>
        </a>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Primary">
          <a
            href="#trip-planner"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Build itinerary
          </a>
          <a
            href="https://wa.me/995551181358?text=Hello%2C%20I%20would%20like%20help%20planning%20my%20Georgia%20trip."
            className={`${buttonVariants({ size: "sm" })} gap-2`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Local help</span>
            <span className="sm:hidden">Help</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
