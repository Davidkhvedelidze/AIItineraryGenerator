import type { ItineraryResult } from "@/types/trip";

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPdfList(items?: string[]): string {
  return (items ?? [])
    .map(cleanText)
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

export function buildPrintableItineraryHtml(result: ItineraryResult): string {
  const days = result.days ?? [];
  const daysHtml = days
    .map(
      (day) => `
        <section class="day">
          <h2>Day ${day.day}: ${escapeHtml(cleanText(day.title))}</h2>
          <p class="region">${escapeHtml(cleanText(day.region))}</p>
          <ul>
            ${cleanText(day.morning) ? `<li><strong>Morning:</strong> ${escapeHtml(cleanText(day.morning))}</li>` : ""}
            ${cleanText(day.afternoon) ? `<li><strong>Afternoon:</strong> ${escapeHtml(cleanText(day.afternoon))}</li>` : ""}
            ${cleanText(day.evening) ? `<li><strong>Evening:</strong> ${escapeHtml(cleanText(day.evening))}</li>` : ""}
            ${cleanText(day.foodSuggestion) ? `<li><strong>Food:</strong> ${escapeHtml(cleanText(day.foodSuggestion))}</li>` : ""}
            ${cleanText(day.travelTip) ? `<li><strong>Travel tip:</strong> ${escapeHtml(cleanText(day.travelTip))}</li>` : ""}
          </ul>
        </section>
      `,
    )
    .join("");

  const bestFor = renderPdfList(result.bestFor);
  const packingTips = renderPdfList(result.packingTips);
  const transportTips = renderPdfList(result.transportTips);
  const localFood = renderPdfList(result.localFoodToTry);

  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(cleanText(result.tripTitle) || "Georgia itinerary")}</title>
        <style>
          @page { margin: 18mm; }
          * { box-sizing: border-box; }
          body {
            color: #2a1607;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.5;
            margin: 0;
          }
          h1 { color: #D99A00; font-size: 28px; margin: 0 0 10px; }
          h2 { color: #F5B700; font-size: 18px; margin: 0 0 4px; }
          h3 { color: #2a1607; font-size: 15px; margin: 22px 0 8px; }
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
          <h1>${escapeHtml(cleanText(result.tripTitle) || "Georgia itinerary")}</h1>
          ${cleanText(result.overview) ? `<p class="overview">${escapeHtml(cleanText(result.overview))}</p>` : ""}
          ${daysHtml}

          <section class="summary">
            ${cleanText(result.estimatedBudget) ? `<h3>Estimated Budget</h3><p>${escapeHtml(cleanText(result.estimatedBudget))}</p>` : ""}
            ${bestFor ? `<h3>Best For</h3><ul>${bestFor}</ul>` : ""}
            ${packingTips ? `<h3>Packing Tips</h3><ul>${packingTips}</ul>` : ""}
            ${transportTips ? `<h3>Transport Tips</h3><ul>${transportTips}</ul>` : ""}
            ${localFood ? `<h3>Local Food To Try</h3><ul>${localFood}</ul>` : ""}
            ${cleanText(result.bookingSuggestion) ? `<h3>Booking Suggestion</h3><p>${escapeHtml(cleanText(result.bookingSuggestion))}</p>` : ""}
          </section>

          <p class="footer">Must See Georgia | info@mustseegeorgia.com | +995 551 181 358</p>
        </main>
      </body>
    </html>`;
}

/** Renders the itinerary into a hidden iframe and opens the browser print dialog (used for "Download / Print PDF"). */
export function printItinerary(result: ItineraryResult): void {
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
  const printWindow = printFrame.contentWindow;

  if (!printDocument || !printWindow) {
    printFrame.remove();
    return;
  }

  printDocument.open();
  printDocument.write(buildPrintableItineraryHtml(result));
  printDocument.close();

  printFrame.onload = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } finally {
      window.setTimeout(() => {
        printFrame.remove();
      }, 1000);
    }
  };
}
