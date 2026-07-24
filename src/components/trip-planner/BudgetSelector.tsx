"use client";

import { memo } from "react";
import { budgetOptions } from "@/constants/trip-options";
import type { TripFormData } from "@/types/trip";
import { cn } from "@/lib/utils";

interface BudgetSelectorProps {
  value: TripFormData["budget"];
  onChange: (value: TripFormData["budget"]) => void;
  error?: boolean;
}

function BudgetSelectorComponent({ value, onChange, error = false }: BudgetSelectorProps) {
  return (
    <div
      className={cn(
        "grid gap-2 rounded-2xl sm:grid-cols-3",
        error && "ring-2 ring-destructive/60 ring-offset-2"
      )}
    >
      {budgetOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === option.value
              ? "border-primary bg-primary-soft shadow-sm"
              : error
                ? "border-destructive/50 bg-white hover:bg-stone-50"
                : "border-stone-200 bg-white hover:bg-stone-50"
          )}
        >
          <p className="font-semibold text-foreground">{option.label}</p>
          <p className="mt-1 text-xs leading-5 text-stone-600">{option.description}</p>
        </button>
      ))}
    </div>
  );
}

export const BudgetSelector = memo(BudgetSelectorComponent);
