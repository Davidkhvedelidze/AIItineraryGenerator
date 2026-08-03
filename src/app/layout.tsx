import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getSiteUrl } from "@/lib/site";
import "antd/dist/reset.css";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const siteUrl = getSiteUrl();
const siteName = "TripMate Georgia";
const siteDescription =
  "Create a realistic Georgia travel itinerary with AI, then get local help for routes, food, transport, and booking support.";
const socialImageUrl =
  "https://tourguide.ge/wp-content/uploads/2019/07/tbilisi-at-night.jpeg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TripMate Georgia - AI Georgia Itinerary Planner",
    template: "%s | TripMate Georgia",
  },
  description: siteDescription,
  keywords: [
    "georgia itinerary planner",
    "Tbilisi trip planner",
    "georgia itinerary",
    "tours in Georgia",
    "private tours in Georgia",
    "Georgia travel planner",
    "Georgia itinerary",
    "AI travel planner",
    "kazbeki tour",
    "Kazbegi tour",
    "Kakheti wine tour",
    "Batumi travel",
    "kutaisi travel",
    "Svaneti travel",
    "Georgia travel guide",
    "sataplia cave tour",
    "Georgia tour booking",
    "Georgia itinerary generator",
    "free Georgia itinerary generator",
    "Georgia travel itinerary",
    "free Georgia travel itinerary",
    "Georgia trip planner",
    "free Georgia trip planner",
    "Georgia travel planner",
    "Georgia country itinerary",
    "Plan a trip to Georgia",
    "Georgia vacation planner",
    "Georgia travel guide",
    "3-day Georgia itinerary",
    "5-day Georgia itinerary",
    "7-day Georgia itinerary",
    "Georgia travel route",
    "Georgia travel guide",
    "Georgia travel tips",
    "Georgia travel planning",
    "Georgia tour planner",
    "Georgia AI itinerary",
    "free AI Georgia itinerary",
    "AI travel planner Georgia",
    "free AI travel planner Georgia",
    "personalized Georgia itinerary",
    "custom Georgia itinerary",
    "create Georgia itinerary for free",
    "free custom Georgia itinerary",
    "Georgia itinerary for tourists",
    "Georgia travel route planner",
    "Your Georgia trip, planned in 60 seconds",
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
    <html lang="en" className={fraunces.variable}>
      <head>
        <GoogleAnalytics />
        <Script
          src="https://tp-em.com/NTUyNzgw.js?t=552780"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
