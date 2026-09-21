import type { AnalyticsEventParams } from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: {
      (command: "event", eventName: string, parameters?: AnalyticsEventParams): void;
      (command: "config", measurementId: string, parameters?: AnalyticsEventParams): void;
      (command: "set", parameters: AnalyticsEventParams): void;
      (command: "js", date: Date): void;
    };
  }
}

export {};
