"use client";

import { memo } from "react";
import type { TripInterest } from "@/types/trip";
import { interestOptions } from "@/constants/trip-options";
import { cn } from "@/lib/utils";

interface InterestSelectorProps {
  selectedInterests: TripInterest[];
  onToggle: (interest: TripInterest) => void;
  disabled?: boolean;
}

function InterestSelectorComponent({ selectedInterests, onToggle, disabled = false }: InterestSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
              "rounded-md border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected ? "border-primary bg-primary/10 text-primary" : "border-input bg-background hover:bg-accent"
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
