"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { FormStep } from "./tripPlannerForm.constants";
import { fieldVariants } from "./tripPlannerForm.constants";

interface TripPlannerNavigationProps {
  currentStep: FormStep;
  isLoading: boolean;
  canSubmit: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function TripPlannerNavigation({ currentStep, isLoading, canSubmit, onBack, onNext }: TripPlannerNavigationProps) {
  return (
    <motion.div className="flex flex-col gap-3 sm:flex-row sm:justify-between" variants={fieldVariants}>
      <Button
        type="button"
        variant="outline"
        className="h-11 rounded-full border-stone-300 px-6 text-foreground hover:bg-stone-50"
        onClick={onBack}
        disabled={isLoading || currentStep === 1}
      >
        Back
      </Button>

      {currentStep < 3 ? (
        <Button
          type="button"
          className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-hover"
          onClick={onNext}
          disabled={isLoading}
        >
          Continue
        </Button>
      ) : (
        <Button
          type="submit"
          className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-hover"
          disabled={isLoading || !canSubmit}
        >
          Generate Custom Itinerary
        </Button>
      )}
    </motion.div>
  );
}
