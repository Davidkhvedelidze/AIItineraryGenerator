"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Select } from "antd";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { preferredCityOptions } from "@/constants/trip-options";
import type { TripFormSchema } from "@/lib/validations/tripFormSchema";
import type { TripFormData, TripInterest } from "@/types/trip";
import { BudgetSelector } from "../BudgetSelector";
import { InterestSelector } from "../InterestSelector";
import { TravelStyleSelector } from "../TravelStyleSelector";
import { fieldVariants, formVariants } from "./tripPlannerForm.constants";

interface TravelPreferencesStepProps {
  control: Control<TripFormSchema>;
  errors: FieldErrors<TripFormSchema>;
  isLoading: boolean;
  selectedInterests: TripInterest[];
  selectedInterestLabels: string;
  budget: TripFormData["budget"];
  travelStyle: TripFormData["travelStyle"];
  onInterestToggle: (interest: TripInterest) => void;
  onBudgetChange: (value: TripFormData["budget"]) => void;
  onTravelStyleChange: (value: TripFormData["travelStyle"]) => void;
}

export function TravelPreferencesStep({
  control,
  errors,
  isLoading,
  selectedInterests,
  selectedInterestLabels,
  budget,
  travelStyle,
  onInterestToggle,
  onBudgetChange,
  onTravelStyleChange,
}: TravelPreferencesStepProps) {
  return (
    <motion.div className="space-y-6" variants={formVariants}>
      <motion.div className="space-y-2" variants={fieldVariants}>
        <Label>Interests (max 5)</Label>
        <InterestSelector
          selectedInterests={selectedInterests}
          onToggle={onInterestToggle}
          disabled={isLoading}
          error={!!errors.interests}
        />
        <p className="text-xs text-muted-foreground">
          Selected: {selectedInterestLabels}
        </p>
        {errors.interests && (
          <p className="text-xs text-destructive">{errors.interests.message}</p>
        )}
      </motion.div>

      <motion.div className="space-y-2" variants={fieldVariants}>
        <Label>Budget</Label>
        <BudgetSelector
          value={budget}
          onChange={onBudgetChange}
          error={!!errors.budget}
        />
        {errors.budget && (
          <p className="text-xs text-destructive">{errors.budget.message}</p>
        )}
      </motion.div>

      <motion.div className="space-y-2" variants={fieldVariants}>
        <Label>Travel Style</Label>
        <TravelStyleSelector
          value={travelStyle}
          onChange={onTravelStyleChange}
          error={!!errors.travelStyle}
        />
        {errors.travelStyle && (
          <p className="text-xs text-destructive">
            {errors.travelStyle.message}
          </p>
        )}
      </motion.div>

      <motion.div className="space-y-2" variants={fieldVariants}>
        <Label htmlFor="preferredCities">Preferred Overnight Cities</Label>
        <Controller
          control={control}
          name="preferredCities"
          render={({ field }) => (
            <Select
              {...field}
              id="preferredCities"
              mode="multiple"
              size="large"
              className="w-full"
              disabled={isLoading}
              maxTagCount="responsive"
              options={preferredCityOptions}
              placeholder="Choose cities for overnight stays"
              status={errors.preferredCities ? "error" : undefined}
            />
          )}
        />
        <p className="text-xs text-muted-foreground">
          Choose the cities you would prefer for overnight stays.
        </p>
        {errors.preferredCities && (
          <p className="text-xs text-destructive">
            {errors.preferredCities.message}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
