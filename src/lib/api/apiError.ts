export type ApiErrorCode =
  | "INVALID_REQUEST"
  | "RATE_LIMITED"
  | "AI_NOT_CONFIGURED"
  | "AI_INVALID_RESPONSE"
  | "AI_UNAVAILABLE"
  | "AI_TIMEOUT"
  | "INTERNAL_ERROR";

export type ApiErrorResponse = {
  success: false;
  code: ApiErrorCode;
  message: string;
};

export class AiNotConfiguredError extends Error {
  constructor(message = "AI itinerary generation is not configured yet.") {
    super(message);
    this.name = "AiNotConfiguredError";
  }
}

export class AiTimeoutError extends Error {
  constructor(message = "AI itinerary generation timed out.") {
    super(message);
    this.name = "AiTimeoutError";
  }
}

export class AiInvalidResponseError extends Error {
  constructor(message = "Received invalid itinerary format.") {
    super(message);
    this.name = "AiInvalidResponseError";
  }
}

const USER_MESSAGES: Record<ApiErrorCode, string> = {
  INVALID_REQUEST: "Invalid request data.",
  RATE_LIMITED: "Too many itinerary requests. Please try again later.",
  AI_NOT_CONFIGURED: "Itinerary generation is temporarily unavailable. Please try again later.",
  AI_INVALID_RESPONSE: "Received invalid itinerary format. Please try again.",
  AI_UNAVAILABLE: "Unable to reach our itinerary service right now. Please try again shortly.",
  AI_TIMEOUT: "Itinerary generation took too long. Please try again.",
  INTERNAL_ERROR: "Unable to generate itinerary right now.",
};

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  INVALID_REQUEST: 400,
  RATE_LIMITED: 429,
  AI_NOT_CONFIGURED: 500,
  AI_INVALID_RESPONSE: 502,
  AI_UNAVAILABLE: 502,
  AI_TIMEOUT: 504,
  INTERNAL_ERROR: 500,
};

/** Strips bearer tokens from a message before it's ever logged. */
export function redactSecrets(message: string | undefined): string | undefined {
  return message?.replace(/Bearer\s+[^'\s]+/g, "Bearer [redacted]");
}

/**
 * Server-side-only structured error details for logs. Never send the
 * output of this function in an API response.
 */
export function getLoggableErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { error };
  }

  const apiError = error as Error & {
    status?: number;
    code?: string;
    type?: string;
    cause?: unknown;
  };
  const cause =
    apiError.cause instanceof Error
      ? {
          name: apiError.cause.name,
          message: redactSecrets(apiError.cause.message),
          code: (apiError.cause as Error & { code?: string }).code,
        }
      : apiError.cause;

  return {
    name: apiError.name,
    message: redactSecrets(apiError.message),
    status: apiError.status,
    code: apiError.code,
    type: apiError.type,
    cause,
  };
}

function classifyErrorCode(error: unknown): ApiErrorCode {
  if (error instanceof AiNotConfiguredError) return "AI_NOT_CONFIGURED";
  if (error instanceof AiTimeoutError) return "AI_TIMEOUT";
  if (error instanceof AiInvalidResponseError) return "AI_INVALID_RESPONSE";

  const apiError = error as { status?: number; code?: string; message?: string; name?: string };

  if (apiError.name === "AbortError") return "AI_TIMEOUT";
  if (apiError.status === 401) return "AI_NOT_CONFIGURED";
  if (apiError.status === 429 || apiError.code === "insufficient_quota") return "AI_UNAVAILABLE";
  if (apiError.message === "Connection error." || (apiError.status !== undefined && apiError.status >= 500)) {
    return "AI_UNAVAILABLE";
  }

  return "INTERNAL_ERROR";
}

/**
 * Maps any thrown error to a safe, typed API error — never leaks provider
 * error messages, API keys, or billing/quota internals to the client.
 */
export function classifyError(error: unknown): { code: ApiErrorCode; status: number; message: string } {
  const code = classifyErrorCode(error);
  return { code, status: STATUS_BY_CODE[code], message: USER_MESSAGES[code] };
}

export function buildErrorResponseBody(error: unknown): ApiErrorResponse {
  const { code, message } = classifyError(error);
  return { success: false, code, message };
}

export function buildErrorResponseBodyForCode(code: ApiErrorCode): ApiErrorResponse {
  return { success: false, code, message: USER_MESSAGES[code] };
}
