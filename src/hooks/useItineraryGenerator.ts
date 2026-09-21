"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { itineraryResultSchema } from "@/lib/validations/itineraryResultSchema";
import { trackEvent } from "@/lib/analytics";
import type {
  GenerateItineraryResponse,
  ItineraryResult,
  TripFormData,
} from "@/types/trip";

const CLIENT_TIMEOUT_MS = 60_000;

type GeneratorState = {
  status: "idle" | "loading" | "success" | "error";
  data: ItineraryResult | null;
  formData: TripFormData | null;
  error: string | null;
  shareId: string | null;
};

type GeneratorAction =
  | { type: "GENERATE_START"; payload: TripFormData }
  | {
      type: "GENERATE_SUCCESS";
      payload: { data: ItineraryResult; shareId: string | null };
    }
  | { type: "GENERATE_ERROR"; payload: string }
  | { type: "RESET" };

const initialState: GeneratorState = {
  status: "idle",
  data: null,
  formData: null,
  error: null,
  shareId: null,
};

function generatorReducer(
  state: GeneratorState,
  action: GeneratorAction,
): GeneratorState {
  switch (action.type) {
    case "GENERATE_START":
      return {
        status: "loading",
        data: null,
        formData: action.payload,
        error: null,
        shareId: null,
      };
    case "GENERATE_SUCCESS":
      return {
        ...state,
        status: "success",
        data: action.payload.data,
        error: null,
        shareId: action.payload.shareId,
      };
    case "GENERATE_ERROR":
      return { ...state, status: "error", data: null, error: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function tripAnalyticsParams(formData: TripFormData) {
  return {
    trip_duration: formData.days,
    travelers_count: formData.travelers,
    tour_type: formData.tourType,
  };
}

async function parseGenerateItineraryResponse(
  response: Response,
): Promise<GenerateItineraryResponse> {
  try {
    const result = (await response.json()) as GenerateItineraryResponse;
    if (result?.success === false) return result;
    if (result?.success === true && itineraryResultSchema.safeParse(result.data).success) return result;
    return { success: false, code: "AI_INVALID_RESPONSE", message: "Received invalid itinerary format. Please try again." };
  } catch {
    return {
      success: false,
      code: "AI_INVALID_RESPONSE",
      message: "Something went wrong. Please try again.",
    };
  }
}

export function useItineraryGenerator() {
  const [state, dispatch] = useReducer(generatorReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const generateItinerary = useCallback(
    async (formData: TripFormData) => {
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        return;
      }

      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      let timedOut = false;
      let failureTracked = false;

      const timeoutId = setTimeout(() => {
        timedOut = true;
        abortController.abort();
      }, CLIENT_TIMEOUT_MS);

      dispatch({ type: "GENERATE_START", payload: formData });
      trackEvent("itinerary_start", tripAnalyticsParams(formData));

      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          signal: abortController.signal,
        });

        const result = await parseGenerateItineraryResponse(response);
        if (abortController.signal.aborted) throw new DOMException("Aborted", "AbortError");

        if (!response.ok || !result.success) {
          const retryAfterSeconds =
            response.status === 429
              ? response.headers.get("Retry-After")
              : null;
          const message =
            !result.success && retryAfterSeconds
              ? `${result.message} Try again in ${retryAfterSeconds}s.`
              : !result.success
                ? result.message
                : "Failed to generate itinerary.";

          const rateLimited = response.status === 429 || (!result.success && result.code === "RATE_LIMITED");
          // Treat API codes as untrusted at runtime; never forward arbitrary response text.
          const knownCodes = ["INVALID_REQUEST", "RATE_LIMITED", "AI_NOT_CONFIGURED", "AI_INVALID_RESPONSE", "AI_UNAVAILABLE", "AI_TIMEOUT", "INTERNAL_ERROR"];
          const code = !result.success && result.code && knownCodes.includes(result.code) ? result.code : "UNKNOWN";
          trackEvent(rateLimited ? "itinerary_rate_limited" : "itinerary_generate_error", {
            ...tripAnalyticsParams(formData),
            error_code: rateLimited ? "RATE_LIMITED" : code,
            http_status: response.status,
          });
          failureTracked = true;

          throw new Error(message);
        }

        dispatch({
          type: "GENERATE_SUCCESS",
          payload: { data: result.data, shareId: result.shareId },
        });
        trackEvent(
          "itinerary_generate_success",
          tripAnalyticsParams(formData),
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          if (timedOut) {
            dispatch({
              type: "GENERATE_ERROR",
              payload: "This is taking longer than expected. Please try again.",
            });
            trackEvent("itinerary_generate_error", {
              ...tripAnalyticsParams(formData),
              error_code: "CLIENT_TIMEOUT",
              http_status: 0,
            });
            return;
          }

          // User-initiated cancellation already reset state; nothing to report.
          return;
        }

        if (!failureTracked) {
          trackEvent("itinerary_generate_error", {
            ...tripAnalyticsParams(formData),
            error_code: "NETWORK_ERROR",
            http_status: 0,
          });
        }
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";
        dispatch({ type: "GENERATE_ERROR", payload: message });
      } finally {
        clearTimeout(timeoutId);
        if (abortControllerRef.current === abortController) abortControllerRef.current = null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const cancelGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    dispatch({ type: "RESET" });
  }, []);

  return {
    status: state.status,
    data: state.data,
    formData: state.formData,
    error: state.error,
    shareId: state.shareId,
    generateItinerary,
    reset,
    cancelGeneration,
  };
}
