"use client";

import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigProvider, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { airportOptions, languageOptions, preferredCityOptions } from "@/constants/trip-options";
import { tripFormSchema, type TripFormSchema } from "@/lib/validations/tripFormSchema";
import type { TripFormData, TripInterest } from "@/types/trip";
import { InterestSelector } from "./InterestSelector";
import { BudgetSelector } from "./BudgetSelector";
import { TravelStyleSelector } from "./TravelStyleSelector";

interface TripPlannerFormProps {
  isLoading: boolean;
  onSubmit: (data: TripFormData) => Promise<void>;
}

const formVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
  }
};

const { RangePicker } = DatePicker;

const defaultDepartureDate = dayjs().add(14, "day").hour(10).minute(0).second(0).millisecond(0);
const defaultArrivalDate = defaultDepartureDate.add(5, "day").hour(18).minute(0).second(0).millisecond(0);

export function TripPlannerForm({ isLoading, onSubmit }: TripPlannerFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TripFormSchema>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      days: 5,
      travelDates: [defaultDepartureDate.toISOString(), defaultArrivalDate.toISOString()],
      arrivalAirport: "Tbilisi International Airport",
      departureAirport: "Tbilisi International Airport",
      preferredCities: ["Tbilisi", "Sighnaghi"],
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
    () => selectedInterests.join(", ") || "None yet",
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
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
          colorPrimary: "#15803d",
          colorSuccess: "#16a34a",
          colorInfo: "#059669",
          controlHeightLG: 44,
          fontFamily: "inherit"
        }
      }}
    >
      <motion.form
        className="space-y-7"
        initial="hidden"
        animate="visible"
        variants={formVariants}
        onSubmit={handleSubmit(async (data) => onSubmit(data))}
      >
        <motion.div className="grid gap-4 sm:grid-cols-2" variants={formVariants}>
          <motion.div className="space-y-2" variants={fieldVariants}>
            <Label htmlFor="days">Trip Length (days)</Label>
            <Input
              id="days"
              type="number"
              min={1}
              max={14}
              disabled={isLoading}
              className="h-11"
              {...register("days", { valueAsNumber: true })}
            />
            {errors.days && <p className="text-xs text-destructive">{errors.days.message}</p>}
          </motion.div>

          <motion.div className="space-y-2" variants={fieldVariants}>
            <Label htmlFor="travelers">Travelers</Label>
            <Input
              id="travelers"
              type="number"
              min={1}
              max={20}
              disabled={isLoading}
              className="h-11"
              {...register("travelers", { valueAsNumber: true })}
            />
            {errors.travelers && <p className="text-xs text-destructive">{errors.travelers.message}</p>}
          </motion.div>

          <motion.div className="space-y-2 sm:col-span-2" variants={fieldVariants}>
            <Label htmlFor="travelDates">Travel Dates</Label>
            <Controller
              control={control}
              name="travelDates"
              render={({ field }) => (
                <RangePicker
                  id="travelDates"
                  value={field.value?.length === 2 ? [dayjs(field.value[0]), dayjs(field.value[1])] : null}
                  onChange={(dates) => {
                    field.onChange(dates?.[0] && dates?.[1] ? [dates[0].toISOString(), dates[1].toISOString()] : undefined);
                  }}
                  onBlur={field.onBlur}
                  showTime={{ format: "HH:mm", minuteStep: 15 }}
                  format="MMM D, YYYY HH:mm"
                  size="large"
                  className="w-full"
                  disabled={isLoading}
                  status={errors.travelDates ? "error" : undefined}
                  allowClear={false}
                />
              )}
            />
            {errors.travelDates && <p className="text-xs text-destructive">{errors.travelDates.message}</p>}
          </motion.div>

          <motion.div className="space-y-2" variants={fieldVariants}>
            <Label htmlFor="arrivalAirport">Arrival Airport</Label>
            <Controller
              control={control}
              name="arrivalAirport"
              render={({ field }) => (
                <Select
                  {...field}
                  id="arrivalAirport"
                  size="large"
                  className="w-full"
                  disabled={isLoading}
                  options={airportOptions}
                  status={errors.arrivalAirport ? "error" : undefined}
                />
              )}
            />
            {errors.arrivalAirport && <p className="text-xs text-destructive">{errors.arrivalAirport.message}</p>}
          </motion.div>

          <motion.div className="space-y-2" variants={fieldVariants}>
            <Label htmlFor="departureAirport">Departure Airport</Label>
            <Controller
              control={control}
              name="departureAirport"
              render={({ field }) => (
                <Select
                  {...field}
                  id="departureAirport"
                  size="large"
                  className="w-full"
                  disabled={isLoading}
                  options={airportOptions}
                  status={errors.departureAirport ? "error" : undefined}
                />
              )}
            />
            {errors.departureAirport && <p className="text-xs text-destructive">{errors.departureAirport.message}</p>}
          </motion.div>

          <motion.div className="space-y-2 sm:col-span-2" variants={fieldVariants}>
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
            <p className="text-xs text-muted-foreground">Choose the cities you would prefer for overnight stays.</p>
            {errors.preferredCities && <p className="text-xs text-destructive">{errors.preferredCities.message}</p>}
          </motion.div>

          <motion.div className="space-y-2" variants={fieldVariants}>
            <Label htmlFor="language">Language</Label>
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <Select
                  {...field}
                  id="language"
                  size="large"
                  className="w-full"
                  disabled={isLoading}
                  options={languageOptions}
                  status={errors.language ? "error" : undefined}
                />
              )}
            />
            {errors.language && <p className="text-xs text-destructive">{errors.language.message}</p>}
          </motion.div>

          <motion.div className="space-y-2" variants={fieldVariants}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
              className="h-11"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </motion.div>
        </motion.div>

        <motion.div className="space-y-2" variants={fieldVariants}>
          <Label>Interests (max 5)</Label>
          <InterestSelector selectedInterests={selectedInterests} onToggle={handleInterestToggle} disabled={isLoading} />
          <p className="text-xs text-muted-foreground">Selected: {selectedInterestLabels}</p>
          {errors.interests && <p className="text-xs text-destructive">{errors.interests.message}</p>}
        </motion.div>

        <motion.div className="space-y-2" variants={fieldVariants}>
          <Label>Budget</Label>
          <BudgetSelector value={watch("budget")} onChange={handleBudgetChange} />
        </motion.div>

        <motion.div className="space-y-2" variants={fieldVariants}>
          <Label>Travel Style</Label>
          <TravelStyleSelector value={watch("travelStyle")} onChange={handleTravelStyleChange} />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <Button type="submit" className="h-11 w-full px-6 sm:w-auto" disabled={isLoading || selectedInterests.length === 0}>
            {isLoading ? "Generating..." : "Generate My Trip"}
          </Button>
        </motion.div>
      </motion.form>
    </ConfigProvider>
  );
}
