import type { ItineraryResult } from "@/lib/validations/itineraryResultSchema";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8_000;

type ItineraryEmail = {
  to: string;
  itinerary: ItineraryResult;
  /** Link to the saved itinerary page; null when Supabase isn't configured. */
  shareUrl: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Deliberately written like a personal note (no brand styling, buttons or sales copy):
 * Gmail files designed, promotional-looking mail under the Promotions tab.
 */
export function buildItineraryEmail({
  itinerary,
  shareUrl,
}: Omit<ItineraryEmail, "to">) {
  const subject = `Your Georgia itinerary: ${itinerary.tripTitle}`;

  const linkLine = shareUrl
    ? `You can open the full day-by-day plan here: ${shareUrl}`
    : null;

  const dayLines = itinerary.days.map(
    (day) =>
      `Day ${day.day} – ${day.title} (${day.region}). Overnight in ${day.overnightStay}.`,
  );

  const paragraphs = [
    "Hi,",
    `Here's the itinerary you just created on TripMate Georgia: ${itinerary.tripTitle}.`,
    itinerary.overview,
    ...(linkLine ? [linkLine] : []),
  ];

  const closing = [
    "If anything should change – dates, pace, places – just reply to this email and we'll help.",
    "Have a great trip,\nTripMate Georgia",
  ];

  const toHtml = (paragraph: string) =>
    `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`;
  const linkHtml = shareUrl
    ? `<p>You can open the full day-by-day plan here: <a href="${escapeHtml(shareUrl)}">${escapeHtml(shareUrl)}</a></p>`
    : "";

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;">
${paragraphs.slice(0, 3).map(toHtml).join("\n")}
${linkHtml}
<p>${dayLines.map(escapeHtml).join("<br>")}</p>
${closing.map(toHtml).join("\n")}
</div>`;

  const text = [...paragraphs, dayLines.join("\n"), ...closing].join("\n\n");

  return { subject, html, text };
}

/**
 * Best-effort: a mail outage or missing config must never fail itinerary generation.
 * Returns whether the email was accepted by the provider.
 */
export async function trySendItineraryEmail(
  email: ItineraryEmail,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ITINERARY_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    console.warn(
      "Itinerary email skipped: RESEND_API_KEY or ITINERARY_EMAIL_FROM is missing.",
    );
    return false;
  }

  const { subject, html, text } = buildItineraryEmail(email);
  const replyTo = process.env.ITINERARY_EMAIL_REPLY_TO?.trim();

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email.to],
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });

    if (!response.ok) {
      // Log the provider's reason but never the recipient address.
      console.error(
        "Itinerary email rejected",
        response.status,
        await response.text(),
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Itinerary email failed",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
