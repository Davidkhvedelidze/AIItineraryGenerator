import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getSiteUrl } from "@/lib/site";
import "antd/dist/reset.css";
import "./globals.css";

const siteUrl = getSiteUrl();
const siteName = "TripMate Georgia";
const siteDescription =
  "Create a realistic Georgia travel itinerary with AI, then get local help for routes, food, transport, and booking support.";
const socialImageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Tbilisi_at_night%2C_Kura%2C_Georgia.jpg/1200px-Tbilisi_at_night%2C_Kura%2C_Georgia.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TripMate Georgia - AI Georgia Itinerary Planner",
    template: "%s | TripMate Georgia",
  },
  description: siteDescription,
  keywords: [
    "tours in Georgia",
    "private tours in Georgia",
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
    title: "TripMate Georgia - AI Georgia Itinerary Planner",
    description: siteDescription,
    locale: "en_US",
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 675,
        alt: "Tbilisi at night in Georgia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TripMate Georgia - AI Georgia Itinerary Planner",
    description: siteDescription,
    images: [socialImageUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "H0wMuRu2da4NbmA4K6tJweGGhO0aUem44kxATFL5TPs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
