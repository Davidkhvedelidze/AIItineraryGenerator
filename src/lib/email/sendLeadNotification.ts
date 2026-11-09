import { CONTACT_EMAIL } from "@/lib/contact";
import { escapeHtml, trySendViaResend } from "@/lib/email/resend";
import type { TripFormData } from "@/types/trip";

export type LeadType = "planner" | "tour_booking" | "itinerary_quote";

/** A lead normalized from any of the site's forms, ready to email to the team. */
export type Lead = {
  type: LeadType;
  /** What the lead is about: a tour title, an itinerary title, … */
  headline: string;
  name?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  travelers?: number | null;
  /** ISO date or datetime strings. */
  startDate?: string | null;
  endDate?: string | null;
  /** Extra label/value rows; empty values are dropped. */
  details?: [label: string, value: string | null | undefined][];
  link?: { label: string; url: string } | null;
  /** Free-text note from the traveler. */
  note?: string | null;
};

const TYPE_LABELS: Record<LeadType, string> = {
  planner: "AI itinerary",
  tour_booking: "Tour booking request",
  itinerary_quote: "Price request for itinerary",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

/** Click-to-chat link for a traveler's number, or null when it doesn't look like one. */
export function toWhatsAppChatUrl(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "").replace(/^00/, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export function buildLeadNotificationEmail(lead: Lead) {
  const start = formatDate(lead.startDate);
  const end = formatDate(lead.endDate);
  const dates = start ? (end && end !== start ? `${start} – ${end}` : start) : null;
  const travelers = lead.travelers
    ? `${lead.travelers} ${lead.travelers === 1 ? "traveler" : "travelers"}`
    : null;
  const chatUrl = toWhatsAppChatUrl(lead.whatsapp);

  const subject = [`🔔 New lead · ${lead.headline}`, travelers, start]
    .filter(Boolean)
    .join(" · ");

  const rows: [string, string][] = (
    [
      ["Type", TYPE_LABELS[lead.type]],
      ["Name", lead.name],
      ["Email", lead.email],
      ["WhatsApp", lead.whatsapp],
      ["Dates", dates],
      ["Travelers", travelers],
      ...(lead.details ?? []),
    ] as [string, string | null | undefined][]
  ).filter((row): row is [string, string] => Boolean(row[1]?.toString().trim()));

  const note = lead.note?.trim() || null;

  const text = [
    `New lead: ${lead.headline}`,
    rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    note ? `Note from traveler:\n${note}` : null,
    chatUrl ? `Reply on WhatsApp: ${chatUrl}` : null,
    lead.link ? `${lead.link.label}: ${lead.link.url}` : null,
    lead.email ? "Reply to this email to answer the traveler directly." : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const actions = [
    chatUrl
      ? `<a href="${escapeHtml(chatUrl)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;border-radius:999px;background:#25D366;color:#fff;font-weight:600;text-decoration:none">Reply on WhatsApp</a>`
      : "",
    lead.link
      ? `<a href="${escapeHtml(lead.link.url)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;border-radius:999px;background:#292005;color:#fff;font-weight:600;text-decoration:none">${escapeHtml(lead.link.label)}</a>`
      : "",
  ].join("");

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.5;color:#292005;max-width:560px">
<h2 style="margin:0 0 12px;font-size:20px">New lead: ${escapeHtml(lead.headline)}</h2>
<table style="border-collapse:collapse;width:100%">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#625741;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>
${note ? `<p style="margin:16px 0 0;padding:12px 16px;background:#f4efe1;border-radius:12px;white-space:pre-wrap">${escapeHtml(note)}</p>` : ""}
${actions ? `<p style="margin:20px 0 0">${actions}</p>` : ""}
${lead.email ? `<p style="margin:16px 0 0;color:#625741;font-size:13px">Reply to this email to answer the traveler directly.</p>` : ""}
</div>`;

  return { subject, html, text };
}

/** Best-effort: never throws, so a mail outage can't break the form that produced the lead. */
export async function trySendLeadNotification(lead: Lead): Promise<boolean> {
  const to = process.env.LEAD_NOTIFY_EMAIL?.trim() || CONTACT_EMAIL;
  const { subject, html, text } = buildLeadNotificationEmail(lead);
  return trySendViaResend({ to, subject, html, text, replyTo: lead.email }, "Lead notification");
}

/** Maps a submitted trip planner form to a lead. */
export function plannerLead(
  form: Pick<
    TripFormData,
    | "email"
    | "mobileNumber"
    | "travelers"
    | "travelDates"
    | "days"
    | "interests"
    | "budget"
    | "travelStyle"
    | "tourType"
    | "preferredCities"
    | "arrivalAirport"
    | "tourDescription"
  >,
  options: {
    type?: Extract<LeadType, "planner" | "itinerary_quote">;
    tripTitle?: string | null;
    itineraryUrl?: string | null;
    generationFailed?: boolean;
  } = {},
): Lead {
  return {
    type: options.type ?? "planner",
    headline: options.tripTitle?.trim() || `${form.days}-day Georgia trip`,
    email: form.email,
    whatsapp: form.mobileNumber,
    travelers: form.travelers,
    startDate: form.travelDates?.[0],
    endDate: form.travelDates?.[1],
    details: [
      ["Length", form.days ? `${form.days} days` : null],
      ["Tour type", form.tourType],
      ["Budget", form.budget],
      ["Pace", form.travelStyle],
      ["Interests", form.interests?.join(", ")],
      ["Cities", form.preferredCities?.join(", ")],
      ["Arrival", form.arrivalAirport],
      [
        "Status",
        options.generationFailed
          ? "AI generation FAILED: traveler has no itinerary, follow up manually"
          : null,
      ],
    ],
    note: form.tourDescription,
    link: options.itineraryUrl ? { label: "Open itinerary", url: options.itineraryUrl } : null,
  };
}
