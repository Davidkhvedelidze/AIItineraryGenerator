export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} TripMate Georgia. All rights reserved.</p>
        <p>Built for first-time visitors exploring Georgia.</p>
      </div>
    </footer>
  );
}
