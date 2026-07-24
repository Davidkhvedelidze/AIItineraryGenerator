"use client";

import { memo } from "react";
import type { TripInterest } from "@/types/trip";
import { interestOptions } from "@/constants/trip-options";
import { cn } from "@/lib/utils";

interface InterestSelectorProps {
  selectedInterests: TripInterest[];
  onToggle: (interest: TripInterest) => void;
  disabled?: boolean;
  error?: boolean;
}

function InterestSelectorComponent({ selectedInterests, onToggle, disabled = false, error = false }: InterestSelectorProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 rounded-2xl sm:grid-cols-3",
        error && "ring-2 ring-destructive/60 ring-offset-2"
      )}
    >
      {interestOptions.map((interest) => {
        const isSelected = selectedInterests.includes(interest.value);

        return (
          <button
            key={interest.value}
            type="button"
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => onToggle(interest.value)}
            className={cn(
              "rounded-xl border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected
                ? "border-primary bg-primary-soft text-foreground shadow-sm"
                : error
                  ? "border-destructive/50 bg-white text-stone-700 hover:bg-stone-50 hover:text-foreground"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-foreground"
            )}
          >
            {interest.label}
          </button>
        );
      })}
    </div>
  );
}

export const InterestSelector = memo(InterestSelectorComponent);
