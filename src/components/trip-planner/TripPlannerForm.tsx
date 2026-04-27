"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { languageOptions, monthOptions, startingCityOptions } from "@/constants/trip-options";
import { tripFormSchema, type TripFormSchema } from "@/lib/validations/tripFormSchema";
import type { TripFormData, TripInterest } from "@/types/trip";
import { InterestSelector } from "./InterestSelector";
import { BudgetSelector } from "./BudgetSelector";
import { TravelStyleSelector } from "./TravelStyleSelector";

interface TripPlannerFormProps {
  isLoading: boolean;
  onSubmit: (data: TripFormData) => Promise<void>;
}

export function TripPlannerForm({ isLoading, onSubmit }: TripPlannerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TripFormSchema>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      days: 5,
      month: "May",
      startingCity: "Tbilisi",
      interests: ["culture"],
      budget: "medium",
      travelStyle: "balanced",
      travelers: 2,
      language: "English",
      email: ""
    }
  });

  const selectedInterests = watch("interests");
  const selectedInterestLabels = useMemo(
    () => selectedInterests.join(", "),
    [selectedInterests]
  );

  const handleInterestToggle = useCallback(
    (interest: TripInterest) => {
      const current = watch("interests");
      const exists = current.includes(interest);

      if (exists) {
        setValue(
          "interests",
          current.filter((item) => item !== interest),
          { shouldValidate: true }
        );
        return;
      }

      if (current.length >= 5) {
        return;
      }

      setValue("interests", [...current, interest], { shouldValidate: true });
    },
    [setValue, watch]
  );

  const handleBudgetChange = useCallback((value: TripFormData["budget"]) => {
    setValue("budget", value, { shouldValidate: true });
  }, [setValue]);

  const handleTravelStyleChange = useCallback((value: TripFormData["travelStyle"]) => {
    setValue("travelStyle", value, { shouldValidate: true });
  }, [setValue]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit(async (data) => onSubmit(data))}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="days">Trip Length (days)</Label>
          <Input id="days" type="number" min={1} max={14} {...register("days", { valueAsNumber: true })} />
          {errors.days && <p className="text-xs text-destructive">{errors.days.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers">Travelers</Label>
          <Input id="travelers" type="number" min={1} max={20} {...register("travelers", { valueAsNumber: true })} />
          {errors.travelers && <p className="text-xs text-destructive">{errors.travelers.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="month">Travel Month</Label>
          <select id="month" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register("month")}>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startingCity">Starting City</Label>
          <select id="startingCity" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register("startingCity")}>
            {startingCityOptions.map((city) => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select id="language" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register("language")}>
            {languageOptions.map((language) => (
              <option key={language.value} value={language.value}>{language.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Interests (max 5)</Label>
        <InterestSelector selectedInterests={selectedInterests} onToggle={handleInterestToggle} disabled={isLoading} />
        <p className="text-xs text-muted-foreground">Selected: {selectedInterestLabels}</p>
        {errors.interests && <p className="text-xs text-destructive">{errors.interests.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Budget</Label>
        <BudgetSelector value={watch("budget")} onChange={handleBudgetChange} />
      </div>

      <div className="space-y-2">
        <Label>Travel Style</Label>
        <TravelStyleSelector value={watch("travelStyle")} onChange={handleTravelStyleChange} />
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || selectedInterests.length === 0}>
        {isLoading ? "Generating..." : "Generate My Trip"}
      </Button>
    </form>
  );
}
