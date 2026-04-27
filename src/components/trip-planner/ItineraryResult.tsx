"use client";

import { useMemo } from "react";
import { Card, Collapse, List, Tag, Timeline } from "antd";
import { CalendarDays, Download, Mail, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import type { ItineraryResult as ItineraryResultType } from "@/types/trip";
import { ItineraryDayCard } from "./ItineraryDayCard";

interface ItineraryResultProps {
  result: ItineraryResultType;
  onReset: () => void;
}

const whatsappBookingUrl =
  "https://wa.me/995551181358?text=Hello%2C%20I%20would%20like%20help%20booking%20my%20Georgia%20trip.";
const emailBookingUrl =
  "mailto:info@mustseegeorgia.com?subject=Georgia%20Trip%20Booking%20Request&body=Hello%2C%0A%0AI%20would%20like%20help%20booking%20my%20Georgia%20trip.%0A";

function getUniqueRegions(days: ItineraryResultType["days"]): string[] {
  return Array.from(
    new Set(days.map((day) => day.region.trim()).filter(Boolean)),
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPdfList(items: string[]): string {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function buildPrintableItineraryHtml(result: ItineraryResultType): string {
  const daysHtml = result.days
    .map(
      (day) => `
        <section class="day">
          <h2>Day ${day.day}: ${escapeHtml(day.title)}</h2>
          <p class="region">${escapeHtml(day.region)}</p>
          <ul>
            <li><strong>Morning:</strong> ${escapeHtml(day.morning)}</li>
            <li><strong>Afternoon:</strong> ${escapeHtml(day.afternoon)}</li>
            <li><strong>Evening:</strong> ${escapeHtml(day.evening)}</li>
            <li><strong>Food:</strong> ${escapeHtml(day.foodSuggestion)}</li>
            <li><strong>Travel tip:</strong> ${escapeHtml(day.travelTip)}</li>
          </ul>
        </section>
      `,
    )
    .join("");

  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(result.tripTitle)}</title>
        <style>
          @page { margin: 18mm; }
          * { box-sizing: border-box; }
          body {
            color: #17211b;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.5;
            margin: 0;
          }
          h1 { color: #14532d; font-size: 28px; margin: 0 0 10px; }
          h2 { color: #166534; font-size: 18px; margin: 0 0 4px; }
          h3 { color: #17211b; font-size: 15px; margin: 22px 0 8px; }
          p { margin: 0 0 10px; }
          ul { margin: 8px 0 0 18px; padding: 0; }
          li { margin: 4px 0; }
          .overview { color: #4b5563; margin-bottom: 18px; }
          .day {
            border-top: 1px solid #d1d5db;
            break-inside: avoid;
            padding: 16px 0;
          }
          .region {
            color: #6b7280;
            font-size: 13px;
            margin-bottom: 8px;
          }
          .summary {
            border-top: 1px solid #d1d5db;
            margin-top: 8px;
            padding-top: 12px;
          }
          .footer {
            border-top: 1px solid #d1d5db;
            color: #6b7280;
            font-size: 12px;
            margin-top: 24px;
            padding-top: 12px;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>${escapeHtml(result.tripTitle)}</h1>
          <p class="overview">${escapeHtml(result.overview)}</p>
          ${daysHtml}

          <section class="summary">
            <h3>Estimated Budget</h3>
            <p>${escapeHtml(result.estimatedBudget)}</p>
            <h3>Best For</h3>
            <ul>${renderPdfList(result.bestFor)}</ul>
            <h3>Packing Tips</h3>
            <ul>${renderPdfList(result.packingTips)}</ul>
            <h3>Transport Tips</h3>
            <ul>${renderPdfList(result.transportTips)}</ul>
            <h3>Local Food To Try</h3>
            <ul>${renderPdfList(result.localFoodToTry)}</ul>
            <h3>Booking Suggestion</h3>
            <p>${escapeHtml(result.bookingSuggestion)}</p>
          </section>

          <p class="footer">Must See Georgia | info@mustseegeorgia.com | +995 551 181 358</p>
        </main>
      </body>
    </html>`;
}

export function ItineraryResult({ result, onReset }: ItineraryResultProps) {
  const mapRegions = useMemo(
    () => getUniqueRegions(result.days),
    [result.days],
  );

  const handleBookingHelp = () => {
    trackEvent("booking_whatsapp_click", {
      trip_title: result.tripTitle
    });
    window.open(whatsappBookingUrl, "_blank", "noopener,noreferrer");
  };

  const handleEmailBookingHelp = () => {
    trackEvent("booking_email_click", {
      trip_title: result.tripTitle
    });
    window.location.href = emailBookingUrl;
  };

  const handleDownloadPdf = () => {
    trackEvent("itinerary_pdf_download_click", {
      trip_title: result.tripTitle,
      days: result.days.length
    });
    const printFrame = document.createElement("iframe");

    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    printFrame.title = "Printable itinerary";
    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentWindow?.document;

    if (!printDocument || !printFrame.contentWindow) {
      printFrame.remove();
      return;
    }

    printDocument.open();
    printDocument.write(buildPrintableItineraryHtml(result));
    printDocument.close();

    printFrame.onload = () => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();

      setTimeout(() => {
        printFrame.remove();
      }, 1000);
    };
  };

  const summary = useMemo(
    () => [
      { title: "Estimated Budget", items: [result.estimatedBudget] },
      { title: "Best For", items: result.bestFor },
      { title: "Packing Tips", items: result.packingTips },
      { title: "Transport Tips", items: result.transportTips },
      { title: "Local Food To Try", items: result.localFoodToTry },
    ],
    [result],
  );

  return (
    <section className="space-y-6" aria-live="polite">
      <Card className="border-border shadow-sm" bordered>
        <div className="space-y-4">
          <div>
            <Tag color="green" className="mb-3">
              AI itinerary
            </Tag>
            <h3 className="text-2xl font-semibold text-foreground">
              {result.tripTitle}
            </h3>
            <p className="mt-2 max-w-4xl text-muted-foreground">
              {result.overview}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {mapRegions.map((region) => (
              <Tag key={region} color="success">
                {region}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card
            title={
              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                Day-by-day plan
              </span>
            }
            className="border-border shadow-sm"
          >
            <Timeline
              items={result.days.map((day) => ({
                color: "green",
                children: (
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        Day {day.day}: {day.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {day.region}
                      </p>
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      <li>
                        <span className="font-medium text-foreground">
                          Morning:
                        </span>{" "}
                        {day.morning}
                      </li>
                      <li>
                        <span className="font-medium text-foreground">
                          Afternoon:
                        </span>{" "}
                        {day.afternoon}
                      </li>
                      <li>
                        <span className="font-medium text-foreground">
                          Evening:
                        </span>{" "}
                        {day.evening}
                      </li>
                      <li>
                        <span className="font-medium text-foreground">
                          Food:
                        </span>{" "}
                        {day.foodSuggestion}
                      </li>
                      <li>
                        <span className="font-medium text-foreground">
                          Travel tip:
                        </span>{" "}
                        {day.travelTip}
                      </li>
                    </ul>
                  </div>
                ),
              }))}
            />
          </Card>

          <Collapse
            bordered
            className="bg-card"
            items={[
              {
                key: "cards",
                label: "Open detailed day cards",
                children: (
                  <div className="space-y-4">
                    {result.days.map((day) => (
                      <ItineraryDayCard key={day.day} dayData={day} />
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>

        <aside>
          <Card title="Quick summary" className="border-border shadow-sm">
            <div className="space-y-4">
              {summary.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 font-medium text-foreground">
                    {section.title}
                  </p>
                  <List
                    size="small"
                    dataSource={section.items}
                    renderItem={(item) => (
                      <List.Item className="px-0">
                        <span className="text-sm text-muted-foreground">
                          • {item}
                        </span>
                      </List.Item>
                    )}
                  />
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>

      <Card className="border-border shadow-sm">
        <div className="flex items-start gap-3">
          <Utensils className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h4 className="font-semibold text-foreground">
              Booking suggestion
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.bookingSuggestion}
            </p>
          </div>
        </div>
      </Card>

      <div className="rounded-lg border bg-primary/5 p-5">
        <p className="font-medium">
          Want help booking this trip with a local expert?
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button type="button" onClick={handleBookingHelp} className="gap-2">
            <svg
              className="h-4 w-4"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16.01 3.2c-7.01 0-12.72 5.61-12.72 12.51 0 2.21.59 4.36 1.71 6.25L3.2 28.8l7.03-1.78a12.91 12.91 0 0 0 5.78 1.39c7.02 0 12.73-5.61 12.73-12.51S23.03 3.2 16.01 3.2Zm0 22.99c-1.86 0-3.69-.49-5.29-1.43l-.38-.22-4.17 1.06 1.11-4.01-.25-.41a10.24 10.24 0 0 1-1.52-5.47c0-5.68 4.71-10.29 10.5-10.29s10.51 4.61 10.51 10.29-4.72 10.48-10.51 10.48Zm5.77-7.72c-.31-.16-1.86-.9-2.15-1-.29-.11-.5-.16-.71.15-.21.31-.82 1-.99 1.2-.18.21-.37.23-.68.08-.31-.16-1.32-.48-2.51-1.52-.93-.82-1.56-1.83-1.74-2.14-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.15-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.71-1.68-.97-2.3-.26-.6-.52-.52-.71-.53h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.59s1.13 3.01 1.29 3.22c.16.21 2.23 3.35 5.39 4.69.75.32 1.34.51 1.8.66.76.24 1.45.21 1.99.13.61-.09 1.86-.75 2.12-1.47.26-.73.26-1.35.18-1.47-.08-.13-.29-.21-.6-.36Z" />
            </svg>
            Request Booking
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleEmailBookingHelp}
            className="gap-2"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Request via Email
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadPdf}
            className="gap-2"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={onReset}>
            Create Another Trip
          </Button>
        </div>
      </div>
    </section>
  );
}
