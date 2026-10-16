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

export function buildItineraryEmail({ itinerary, shareUrl }: Omit<ItineraryEmail, "to">) {
  const subject = `Your Georgia itinerary: ${itinerary.tripTitle}`;

  const daysHtml = itinerary.days
    .map(
      (day) => `
        <tr><td style="padding:14px 0;border-top:1px solid #e1d7c2;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#625741;">Day ${day.day} · ${escapeHtml(day.region)}</p>
          <p style="margin:0 0 6px;font-size:16px;font-weight:600;color:#292005;">${escapeHtml(day.title)}</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#3d3420;">${escapeHtml(day.morning)} ${escapeHtml(day.afternoon)} ${escapeHtml(day.evening)}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#625741;">Overnight: ${escapeHtml(day.overnightStay)}</p>
        </td></tr>`,
    )
    .join("");

  const buttonHtml = shareUrl
    ? `<p style="margin:24px 0;"><a href="${escapeHtml(shareUrl)}" style="display:inline-block;background:#f5b700;color:#292005;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:12px;">Open your full itinerary</a></p>`
    : "";

  const html = `<!doctype html>
<html><body style="margin:0;background:#fffdf7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:13px;color:#625741;">TripMate Georgia</p>
        <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#292005;">${escapeHtml(itinerary.tripTitle)}</h1>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#3d3420;">${escapeHtml(itinerary.overview)}</p>
        ${buttonHtml}
      </td></tr>
      ${daysHtml}
      <tr><td style="padding-top:20px;border-top:1px solid #e1d7c2;font-size:13px;line-height:1.6;color:#625741;">
        Estimated budget: ${escapeHtml(itinerary.estimatedBudget)}<br>
        Reply to this email if you'd like our local team to turn this plan into a private trip.
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

  const text = [
    itinerary.tripTitle,
    "",
    itinerary.overview,
    ...(shareUrl ? ["", `Open your full itinerary: ${shareUrl}`] : []),
    "",
    ...itinerary.days.map(
      (day) => `Day ${day.day} – ${day.title} (${day.region})\n${day.morning} ${day.afternoon} ${day.evening}\nOvernight: ${day.overnightStay}`,
    ),
    "",
    `Estimated budget: ${itinerary.estimatedBudget}`,
  ].join("\n");

  return { subject, html, text };
}

/**
 * Best-effort: a mail outage or missing config must never fail itinerary generation.
 * Returns whether the email was accepted by the provider.
 */
export async function trySendItineraryEmail(email: ItineraryEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ITINERARY_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    console.warn("Itinerary email skipped: RESEND_API_KEY or ITINERARY_EMAIL_FROM is missing.");
    return false;
  }

  const { subject, html, text } = buildItineraryEmail(email);
  const replyTo = process.env.ITINERARY_EMAIL_REPLY_TO?.trim();

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
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
      console.error("Itinerary email rejected", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Itinerary email failed", error instanceof Error ? error.message : error);
    return false;
  }
}
