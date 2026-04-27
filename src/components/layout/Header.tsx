import { Compass } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <a href="#top" className="inline-flex items-center gap-2 font-semibold text-foreground">
          <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>TripMate Georgia</span>
        </a>
        <a href="#trip-planner" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          Plan My Georgia Trip
        </a>
      </div>
    </header>
  );
}
