import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getAdminSecret(): string | null {
  return process.env.ADMIN_SECRET?.trim() || null;
}

/** Constant-time string comparison that tolerates different lengths. */
export function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(`admin-session:${payload}`).digest("base64url");
}

/**
 * Session token = `<expiresAtMs>.<hmac>`. The raw ADMIN_SECRET never leaves the
 * server, and rotating ADMIN_SECRET invalidates every issued session.
 */
export function createAdminSessionToken(now = Date.now()): string | null {
  const secret = getAdminSecret();
  if (!secret) return null;

  const expiresAt = String(now + ADMIN_SESSION_MAX_AGE_SECONDS * 1000);
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function verifyAdminSessionToken(token: string | undefined, now = Date.now()): boolean {
  const secret = getAdminSecret();
  if (!secret || !token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= now) return false;

  return safeEqual(signature, sign(expiresAt, secret));
}

export function isValidAdminSecret(candidate: string): boolean {
  const secret = getAdminSecret();
  return Boolean(secret) && safeEqual(candidate, secret as string);
}

/** Only allow same-site absolute paths ("/admin/..."), never "//host" or "https://...". */
export function sanitizeAdminRedirect(value: unknown, fallback = "/admin/gallery"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

export function isAdminAuthorized(): boolean {
  return verifyAdminSessionToken(cookies().get(ADMIN_SESSION_COOKIE)?.value);
}
