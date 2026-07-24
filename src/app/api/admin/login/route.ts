import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/adminAuth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const secret = String(formData.get("secret") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin/gallery");

  const adminSecret = process.env.ADMIN_SECRET?.trim();
  const isValid = Boolean(adminSecret) && secret === adminSecret;

  const destination = new URL(
    isValid ? redirectTo : `${redirectTo}?error=1`,
    request.url,
  );

  const response = NextResponse.redirect(destination, { status: 303 });

  if (isValid) {
    response.cookies.set(ADMIN_SESSION_COOKIE, secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}
