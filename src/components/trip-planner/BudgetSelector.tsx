"use client";

import { memo } from "react";
import { budgetOptions } from "@/constants/trip-options";
import type { TripFormData } from "@/types/trip";
import { cn } from "@/lib/utils";

interface BudgetSelectorProps {
  value: TripFormData["budget"];
  onChange: (value: TripFormData["budget"]) => void;
}

function BudgetSelectorComponent({ value, onChange }: BudgetSelectorProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {budgetOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === option.value ? "border-primary bg-primary/10" : "hover:bg-accent"
          )}
        >
          <p className="font-medium">{option.label}</p>
          <p className="text-xs text-muted-foreground">{option.description}</p>
        </button>
      ))}
    </div>
  );
}

export const BudgetSelector = memo(BudgetSelectorComponent);
