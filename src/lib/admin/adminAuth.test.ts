import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: () => ({ get: () => undefined }) }));

import {
  createAdminSessionToken,
  isValidAdminSecret,
  sanitizeAdminRedirect,
  verifyAdminSessionToken,
} from "./adminAuth";

describe("admin session tokens", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_SECRET", "correct-horse-battery-staple");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("issues a token that verifies and does not contain the raw secret", () => {
    const token = createAdminSessionToken();

    expect(token).toBeTruthy();
    expect(token).not.toContain("correct-horse");
    expect(verifyAdminSessionToken(token ?? undefined)).toBe(true);
  });

  it("rejects expired, tampered, and malformed tokens", () => {
    const now = Date.now();
    const token = createAdminSessionToken(now) as string;
    const [expiresAt, signature] = token.split(".");

    expect(verifyAdminSessionToken(token, now + 8 * 24 * 60 * 60 * 1000)).toBe(false);
    expect(verifyAdminSessionToken(`${Number(expiresAt) + 1}.${signature}`)).toBe(false);
    expect(verifyAdminSessionToken("correct-horse-battery-staple")).toBe(false);
    expect(verifyAdminSessionToken(undefined)).toBe(false);
  });

  it("invalidates sessions when ADMIN_SECRET rotates", () => {
    const token = createAdminSessionToken() as string;
    vi.stubEnv("ADMIN_SECRET", "rotated-secret");

    expect(verifyAdminSessionToken(token)).toBe(false);
  });

  it("rejects everything when ADMIN_SECRET is unset", () => {
    vi.stubEnv("ADMIN_SECRET", "");

    expect(createAdminSessionToken()).toBeNull();
    expect(isValidAdminSecret("")).toBe(false);
  });

  it("checks the secret", () => {
    expect(isValidAdminSecret("correct-horse-battery-staple")).toBe(true);
    expect(isValidAdminSecret("wrong")).toBe(false);
  });
});

describe("sanitizeAdminRedirect", () => {
  it.each([
    ["/admin/gallery", "/admin/gallery"],
    ["https://evil.example", "/admin/gallery"],
    ["//evil.example", "/admin/gallery"],
    ["/\\evil.example", "/admin/gallery"],
    [null, "/admin/gallery"],
  ])("%s -> %s", (input, expected) => {
    expect(sanitizeAdminRedirect(input)).toBe(expected);
  });
});
