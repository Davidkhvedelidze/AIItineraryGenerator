export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-black py-8 text-amber-50">
      <div className="container grid gap-4 text-sm text-amber-50/75 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="font-serif text-lg font-semibold text-white">
            TripMate Georgia by Must See Georgia
          </p>
          <p>
            © {new Date().getFullYear()} TripMate Georgia. Built for first-time
            visitors exploring Georgia.
          </p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <a className="hover:text-white" href="mailto:info@mustseegeorgia.com">
            info@mustseegeorgia.com
          </a>
          <a className="hover:text-white" href="tel:+995551181358">
            +995 551 181 358
          </a>
        </div>
      </div>
    </footer>
  );
}
