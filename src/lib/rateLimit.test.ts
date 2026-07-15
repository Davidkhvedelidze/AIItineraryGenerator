import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, checkSupabaseRateLimit } from "./rateLimit";

describe("checkRateLimit (in-memory)", () => {
  it("allows requests under the limit", () => {
    const key = `test-${Math.random()}`;
    const result = checkRateLimit(key, { limit: 3, windowMs: 60_000 });

    expect(result.allowed).toBe(true);
  });

  it("blocks requests once the limit is exceeded", () => {
    const key = `test-${Math.random()}`;
    const options = { limit: 2, windowMs: 60_000 };

    checkRateLimit(key, options);
    checkRateLimit(key, options);
    const third = checkRateLimit(key, options);

    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets the count after the window elapses", () => {
    const key = `test-${Math.random()}`;
    const options = { limit: 1, windowMs: 1_000 };

    vi.useFakeTimers();
    try {
      checkRateLimit(key, options);
      expect(checkRateLimit(key, options).allowed).toBe(false);

      vi.advanceTimersByTime(1_001);

      expect(checkRateLimit(key, options).allowed).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("checkSupabaseRateLimit", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it("fails open when Supabase env vars are not configured", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const result = await checkSupabaseRateLimit({ identifier: "1.2.3.4:a@b.com", limit: 5, windowMs: 60_000 });

    expect(result.allowed).toBe(true);
  });

  it("allows the request when the RPC reports allowed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ count: 1, allowed: true, retry_after_seconds: 0 }],
      }),
    );

    const result = await checkSupabaseRateLimit({ identifier: "1.2.3.4:a@b.com", limit: 5, windowMs: 60_000 });

    expect(result.allowed).toBe(true);
  });

  it("blocks the request when the RPC reports not allowed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ count: 6, allowed: false, retry_after_seconds: 120 }],
      }),
    );

    const result = await checkSupabaseRateLimit({ identifier: "1.2.3.4:a@b.com", limit: 5, windowMs: 60_000 });

    expect(result).toEqual({ allowed: false, retryAfterSeconds: 120 });
  });

  it("fails open when the RPC call errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const result = await checkSupabaseRateLimit({ identifier: "1.2.3.4:a@b.com", limit: 5, windowMs: 60_000 });

    expect(result.allowed).toBe(true);
  });

  it("fails open when the RPC responds with a non-OK status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const result = await checkSupabaseRateLimit({ identifier: "1.2.3.4:a@b.com", limit: 5, windowMs: 60_000 });

    expect(result.allowed).toBe(true);
  });
});
