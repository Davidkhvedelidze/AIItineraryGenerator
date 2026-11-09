import type { ItineraryResult } from "@/lib/validations/itineraryResultSchema";
import { escapeHtml, trySendViaResend } from "@/lib/email/resend";

// Same number as the site's WhatsApp buttons.
const WHATSAPP_NUMBER = "995551181358";
const WHATSAPP_DISPLAY = "+995 551 18 13 58";

type ItineraryEmail = {
  to: string;
  itinerary: ItineraryResult;
  /** Link to the saved itinerary page; null when Supabase isn't configured. */
  shareUrl: string | null;
};

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

  // Prefilled like the site's floating WhatsApp button, so we know which plan they mean.
  const whatsappMessage = shareUrl
    ? `Hi! I have a question about my Georgia itinerary: ${shareUrl}`
    : `Hi! I have a question about my Georgia itinerary: ${itinerary.tripTitle}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
  const contactIntro =
    "Questions, changes to dates or places, or want us to arrange the trip? Message us on WhatsApp:";
  const signOff = "Have a great trip,\nTripMate Georgia";

  const toHtml = (paragraph: string) =>
    `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`;
  const linkHtml = shareUrl
    ? `<p>You can open the full day-by-day plan here: <a href="${escapeHtml(shareUrl)}">${escapeHtml(shareUrl)}</a></p>`
    : "";

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;">
${paragraphs.slice(0, 3).map(toHtml).join("\n")}
${linkHtml}
<p>${dayLines.map(escapeHtml).join("<br>")}</p>
<p>${escapeHtml(contactIntro)} <a href="${escapeHtml(whatsappUrl)}">${WHATSAPP_DISPLAY}</a></p>
${toHtml(signOff)}
</div>`;

  const text = [
    ...paragraphs,
    dayLines.join("\n"),
    `${contactIntro} ${WHATSAPP_DISPLAY} (${whatsappUrl})`,
    signOff,
  ].join("\n\n");

  return { subject, html, text };
}

/**
 * Best-effort: a mail outage or missing config must never fail itinerary generation.
 * Returns whether the email was accepted by the provider.
 */
export async function trySendItineraryEmail(
  email: ItineraryEmail,
): Promise<boolean> {
  const { subject, html, text } = buildItineraryEmail(email);

  return trySendViaResend(
    {
      to: email.to,
      subject,
      html,
      text,
      replyTo: process.env.ITINERARY_EMAIL_REPLY_TO,
    },
    "Itinerary",
  );
}
