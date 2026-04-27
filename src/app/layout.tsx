import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getSiteUrl } from "@/lib/site";
import "antd/dist/reset.css";
import "./globals.css";

const siteUrl = getSiteUrl();
const siteName = "TripMate Georgia";
const siteDescription =
  "Create a personalized Georgia travel itinerary with AI. Plan your trip by interests, budget, travel style, and number of days.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TripMate Georgia - AI Travel Itinerary Planner",
    template: "%s | TripMate Georgia",
  },
  description: siteDescription,
  keywords: [
    "Georgia travel planner",
    "Georgia itinerary",
    "AI travel planner",
    "Tbilisi trip planner",
    "Kazbegi tour",
    "Kakheti wine tour",
    "Batumi travel",
    "Georgia tour booking",
    "Georgia itinerary generator",
    "Georgia travel itinerary",
    "Georgia trip planner",
    "Georgia travel planner",
    "Georgia country itinerary",
    "Plan a trip to Georgia",
    "Georgia vacation planner",
    "Georgia travel guide",
    "Georgia tour planner",
    "Georgia AI itinerary",
    "AI travel planner Georgia",
    "personalized Georgia itinerary",
    "custom Georgia itinerary",
    "Georgia itinerary for tourists",
    "Georgia travel route planner",
  ],
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: "TripMate Georgia - AI Travel Itinerary Planner",
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripMate Georgia - AI Travel Itinerary Planner",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
