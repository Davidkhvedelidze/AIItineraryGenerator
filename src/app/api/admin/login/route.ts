import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  isValidAdminSecret,
  sanitizeAdminRedirect,
} from "@/lib/admin/adminAuth";
import { checkRateLimit, checkSupabaseRateLimit, getClientIp } from "@/lib/rateLimit";

const loginRateLimit = {
  limit: 5,
  windowMs: 15 * 60 * 1000,
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const secret = String(formData.get("secret") ?? "");
  const redirectTo = sanitizeAdminRedirect(formData.get("redirectTo"));

  const rateLimitKey = `admin-login:${getClientIp(request)}`;
  const inMemoryRateLimit = checkRateLimit(rateLimitKey, loginRateLimit);
  const durableRateLimit = inMemoryRateLimit.allowed
    ? await checkSupabaseRateLimit({ identifier: rateLimitKey, ...loginRateLimit })
    : inMemoryRateLimit;

  if (!durableRateLimit.allowed) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=rate`, request.url), { status: 303 });
  }

  const token = isValidAdminSecret(secret) ? createAdminSessionToken() : null;
  const destination = new URL(token ? redirectTo : `${redirectTo}?error=1`, request.url);
  const response = NextResponse.redirect(destination, { status: 303 });

  if (token) {
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });
  }

  return response;
}
