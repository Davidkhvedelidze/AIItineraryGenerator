"use client";

import { memo } from "react";
import { tourTypeOptions } from "@/constants/trip-options";
import type { TourType } from "@/types/trip";
import { cn } from "@/lib/utils";

interface TourTypeSelectorProps {
  value: TourType | undefined;
  onChange: (value: TourType) => void;
  error?: boolean;
}

function TourTypeSelectorComponent({
  value,
  onChange,
  error = false,
}: TourTypeSelectorProps) {
  return (
    <div
      className={cn(
        "grid gap-2 rounded-2xl sm:grid-cols-2",
        error && "ring-2 ring-destructive/60 ring-offset-2",
      )}
    >
      {tourTypeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-xl border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border-primary bg-primary-soft text-foreground shadow-sm",
            value === option.value
              ? "border-primary bg-primary-soft shadow-sm"
              : error
                ? "border-destructive/50 bg-white hover:bg-stone-50"
                : "border-stone-200 bg-white hover:bg-stone-50",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export const TourTypeSelector = memo(TourTypeSelectorComponent);
