"use client";

import { useCallback, useReducer } from "react";
import { trackEvent } from "@/lib/analytics";
import type { GenerateItineraryResponse, ItineraryResult, TripFormData } from "@/types/trip";

type GeneratorState = {
  status: "idle" | "loading" | "success" | "error";
  data: ItineraryResult | null;
  error: string | null;
};

type GeneratorAction =
  | { type: "GENERATE_START" }
  | { type: "GENERATE_SUCCESS"; payload: ItineraryResult }
  | { type: "GENERATE_ERROR"; payload: string }
  | { type: "RESET" };

const initialState: GeneratorState = {
  status: "idle",
  data: null,
  error: null
};

function generatorReducer(state: GeneratorState, action: GeneratorAction): GeneratorState {
  switch (action.type) {
    case "GENERATE_START":
      return { status: "loading", data: null, error: null };
    case "GENERATE_SUCCESS":
      return { status: "success", data: action.payload, error: null };
    case "GENERATE_ERROR":
      return { status: "error", data: null, error: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useItineraryGenerator() {
  const [state, dispatch] = useReducer(generatorReducer, initialState);

  const generateItinerary = useCallback(async (formData: TripFormData) => {
    dispatch({ type: "GENERATE_START" });
    trackEvent("itinerary_generation_started", {
      days: formData.days,
      travelers: formData.travelers,
      budget: formData.budget,
      travel_style: formData.travelStyle,
      language: formData.language
    });

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = (await response.json()) as GenerateItineraryResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.success ? "Failed to generate itinerary." : result.message);
      }

      dispatch({ type: "GENERATE_SUCCESS", payload: result.data });
      trackEvent("itinerary_generation_succeeded", {
        days: formData.days,
        travelers: formData.travelers,
        budget: formData.budget,
        travel_style: formData.travelStyle,
        language: formData.language
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      dispatch({ type: "GENERATE_ERROR", payload: message });
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    status: state.status,
    data: state.data,
    error: state.error,
    generateItinerary,
    reset
  };
}
