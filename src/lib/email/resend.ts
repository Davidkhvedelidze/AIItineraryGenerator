const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8_000;

export type ResendMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string | null;
};

/**
 * Best-effort send through Resend: never throws. Returns whether the provider accepted
 * the message. `label` only names the message in logs; recipient addresses are never logged.
 */
export async function trySendViaResend(
  message: ResendMessage,
  label: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ITINERARY_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    console.warn(
      `${label} email skipped: RESEND_API_KEY or ITINERARY_EMAIL_FROM is missing.`,
    );
    return false;
  }

  const replyTo = message.replyTo?.trim();

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`${label} email rejected`, response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `${label} email failed`,
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
