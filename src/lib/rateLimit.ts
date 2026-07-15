import { createHash } from "node:crypto";

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Fast, per-instance check. On serverless this state is not shared across
 * instances/regions, so it only catches bursts hitting the same warm
 * instance — pair it with `checkSupabaseRateLimit` for a durable limit.
 */
export function checkRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

type DurableRateLimitConfig = {
  identifier: string;
  limit: number;
  windowMs: number;
};

/**
 * Normalizes a raw ip:email identifier into a stable, non-reversible key so
 * the durable store never has to persist raw email addresses or IPs.
 */
function hashRateLimitIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier).digest("hex");
}

/**
 * Durable rate limit backed by a Supabase Postgres function
 * (`increment_rate_limit`, see supabase/rate_limits.sql) that atomically
 * increments a per-key counter in a single statement, so concurrent
 * requests across serverless instances/regions can't race past the limit.
 * Fails open (allows the request) if Supabase isn't configured or the RPC
 * call errors, so an infra hiccup never blocks legitimate users outright —
 * the in-memory limiter still provides a baseline of protection in that case.
 *
 * The backend is intentionally isolated behind this function so a
 * Redis/Upstash implementation could be swapped in later (e.g. gated by a
 * `RATE_LIMIT_BACKEND=redis` env var) without touching call sites.
 */
export async function checkSupabaseRateLimit(
  config: DurableRateLimitConfig,
): Promise<RateLimitResult> {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey || !config.identifier) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const rpcUrl = `${url.replace(/\/$/, "")}/rest/v1/rpc/increment_rate_limit`;
  const key = hashRateLimitIdentifier(config.identifier);

  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_key: key,
        p_window_seconds: Math.ceil(config.windowMs / 1000),
        p_limit: config.limit,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return { allowed: true, retryAfterSeconds: 0 };
    }

    const rows = (await response.json()) as Array<{
      allowed: boolean;
      retry_after_seconds: number;
    }>;
    const result = rows[0];

    if (!result) {
      return { allowed: true, retryAfterSeconds: 0 };
    }

    return {
      allowed: result.allowed,
      retryAfterSeconds: result.allowed ? 0 : result.retry_after_seconds,
    };
  } catch {
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
