"use client";

import Script from "next/script";
import { Suspense, useState } from "react";
import { AnalyticsPageViews } from "./AnalyticsPageViews";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  const [ready, setReady] = useState(false);
  if (!gaId) return null;

  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive" onReady={() => setReady(true)}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(gaId).replace(/</g, "\\u003c")}, {
            send_page_view: false,
            page_location: window.location.origin,
            page_referrer: '',
            page_title: 'TripMate Georgia'
          });
        `}
      </Script>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="afterInteractive"
      />
      <Suspense fallback={null}>
        <AnalyticsPageViews ready={ready} />
      </Suspense>
    </>
  );
}
