export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container grid gap-4 text-sm text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="font-medium text-foreground">
            TripMate Georgia by Must See Georgia
          </p>
          <p>
            © {new Date().getFullYear()} TripMate Georgia. Built for first-time
            visitors exploring Georgia.
          </p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <a className="hover:text-foreground" href="mailto:info@mustseegeorgia.com">
            info@mustseegeorgia.com
          </a>
          <a className="hover:text-foreground" href="tel:+995551181358">
            +995 551 181 358
          </a>
        </div>
      </div>
    </footer>
  );
}
