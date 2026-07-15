import { describe, expect, it } from "vitest";
import {
  AiInvalidResponseError,
  AiNotConfiguredError,
  AiTimeoutError,
  classifyError,
  getLoggableErrorDetails,
} from "./apiError";

describe("classifyError", () => {
  it("maps AiNotConfiguredError to AI_NOT_CONFIGURED / 500", () => {
    expect(classifyError(new AiNotConfiguredError())).toEqual({
      code: "AI_NOT_CONFIGURED",
      status: 500,
      message: expect.any(String),
    });
  });

  it("maps AiTimeoutError to AI_TIMEOUT / 504", () => {
    expect(classifyError(new AiTimeoutError()).code).toBe("AI_TIMEOUT");
    expect(classifyError(new AiTimeoutError()).status).toBe(504);
  });

  it("maps AiInvalidResponseError to AI_INVALID_RESPONSE / 502", () => {
    expect(classifyError(new AiInvalidResponseError()).code).toBe("AI_INVALID_RESPONSE");
    expect(classifyError(new AiInvalidResponseError()).status).toBe(502);
  });

  it("maps a 401 provider error to AI_NOT_CONFIGURED", () => {
    expect(classifyError({ status: 401 }).code).toBe("AI_NOT_CONFIGURED");
  });

  it("maps a 429 / insufficient_quota provider error to AI_UNAVAILABLE", () => {
    expect(classifyError({ status: 429 }).code).toBe("AI_UNAVAILABLE");
    expect(classifyError({ code: "insufficient_quota" }).code).toBe("AI_UNAVAILABLE");
  });

  it("maps a connection error to AI_UNAVAILABLE / 502", () => {
    expect(classifyError({ message: "Connection error." }).code).toBe("AI_UNAVAILABLE");
  });

  it("maps an AbortError to AI_TIMEOUT", () => {
    expect(classifyError({ name: "AbortError" }).code).toBe("AI_TIMEOUT");
  });

  it("falls back to INTERNAL_ERROR / 500 for unrecognized errors", () => {
    expect(classifyError(new Error("something odd"))).toEqual({
      code: "INTERNAL_ERROR",
      status: 500,
      message: expect.any(String),
    });
  });
});

describe("getLoggableErrorDetails", () => {
  it("redacts a bearer token from the logged message", () => {
    const error = new Error("Request failed: Authorization: Bearer sk-super-secret-token");
    const details = getLoggableErrorDetails(error);

    expect(details.message).not.toContain("sk-super-secret-token");
    expect(details.message).toContain("Bearer [redacted]");
  });
});
