/** Single source for public contact details used across CTAs, footer and structured data. */
export const CONTACT_PHONE = "+995551181358";
export const CONTACT_PHONE_DISPLAY = "+995 551 181 358";
export const CONTACT_EMAIL = "info@mustseegeorgia.com";

const WHATSAPP_NUMBER = CONTACT_PHONE.replace(/\D/g, "");

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello, I would like help planning my Georgia trip.";

export function buildWhatsAppUrl(message: string = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Bare profile link (no prefilled text), for structured data `sameAs`. */
export const WHATSAPP_PROFILE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
