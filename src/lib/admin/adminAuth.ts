import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";

/**
 * Single shared-secret gate for the admin surface — no user accounts. The
 * cookie value is the raw secret, but it's httpOnly + secure + sameSite=lax,
 * so it's only ever readable by the server, and only ever set after a
 * successful comparison against ADMIN_SECRET in /api/admin/login.
 */
export function isAdminAuthorized(): boolean {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return false;

  const cookieValue = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return cookieValue === secret;
}
