"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import type { GenerateItineraryResponse, ItineraryResult, TripFormData } from "@/types/trip";

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
  | { type: "GENERATE_SUCCESS"; payload: { data: ItineraryResult; shareId: string | null } }
  | { type: "GENERATE_ERROR"; payload: string }
  | { type: "RESET" };

const initialState: GeneratorState = {
  status: "idle",
  data: null,
  formData: null,
  error: null,
  shareId: null
};

function generatorReducer(state: GeneratorState, action: GeneratorAction): GeneratorState {
  switch (action.type) {
    case "GENERATE_START":
      return { status: "loading", data: null, formData: action.payload, error: null, shareId: null };
    case "GENERATE_SUCCESS":
      return { ...state, status: "success", data: action.payload.data, error: null, shareId: action.payload.shareId };
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
    days: formData.days,
    travelers: formData.travelers,
    budget: formData.budget,
    travel_style: formData.travelStyle,
    tour_type: formData.tourType,
    language: formData.language
  };
}

async function parseGenerateItineraryResponse(response: Response): Promise<GenerateItineraryResponse> {
  try {
    return (await response.json()) as GenerateItineraryResponse;
  } catch {
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export function useItineraryGenerator() {
  const [state, dispatch] = useReducer(generatorReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timedOutRef = useRef(false);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const generateItinerary = useCallback(async (formData: TripFormData) => {
    if (state.status === "loading") {
      return;
    }

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    timedOutRef.current = false;

    const timeoutId = setTimeout(() => {
      timedOutRef.current = true;
      abortController.abort();
    }, CLIENT_TIMEOUT_MS);

    dispatch({ type: "GENERATE_START", payload: formData });
    trackEvent("itinerary_generation_started", tripAnalyticsParams(formData));

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: abortController.signal
      });

      const result = await parseGenerateItineraryResponse(response);

      if (!response.ok || !result.success) {
        const retryAfterSeconds = response.status === 429 ? response.headers.get("Retry-After") : null;
        const message =
          !result.success && retryAfterSeconds
            ? `${result.message} Try again in ${retryAfterSeconds}s.`
            : !result.success
              ? result.message
              : "Failed to generate itinerary.";

        trackEvent("itinerary_generation_failed", {
          code: !result.success ? result.code ?? "UNKNOWN" : "UNKNOWN",
          status: response.status
        });

        throw new Error(message);
      }

      dispatch({ type: "GENERATE_SUCCESS", payload: { data: result.data, shareId: result.shareId } });
      trackEvent("itinerary_generation_succeeded", tripAnalyticsParams(formData));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        if (timedOutRef.current) {
          dispatch({ type: "GENERATE_ERROR", payload: "This is taking longer than expected. Please try again." });
          trackEvent("itinerary_generation_failed", { code: "CLIENT_TIMEOUT", status: 0 });
          return;
        }

        // User-initiated cancellation already reset state; nothing to report.
        return;
      }

      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      dispatch({ type: "GENERATE_ERROR", payload: message });
    } finally {
      clearTimeout(timeoutId);
    }
  }, [state.status]);

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
    cancelGeneration
  };
}
