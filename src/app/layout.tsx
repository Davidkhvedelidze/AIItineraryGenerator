import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripMate Georgia — AI Travel Itinerary Planner",
  description:
    "Create a personalized Georgia travel itinerary with AI. Plan your trip by interests, budget, travel style, and number of days."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}
