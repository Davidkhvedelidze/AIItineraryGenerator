"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { airportOptions, tourTypeOptions } from "@/constants/trip-options";
import type { TripFormSchema } from "@/lib/validations/tripFormSchema";
import { calculateTripLength } from "./tripPlannerForm.utils";
import { fieldVariants, formVariants } from "./tripPlannerForm.constants";

const { RangePicker } = DatePicker;

interface TripBasicsStepProps {
  control: Control<TripFormSchema>;
  register: UseFormRegister<TripFormSchema>;
  errors: FieldErrors<TripFormSchema>;
  setValue: UseFormSetValue<TripFormSchema>;
  isLoading: boolean;
  tripLength: { days: number | null; nights: number | null };
}

export function TripBasicsStep({ control, register, errors, setValue, isLoading, tripLength }: TripBasicsStepProps) {
  return (
    <motion.div className="grid gap-4 sm:grid-cols-2" variants={formVariants}>
      <motion.div className="space-y-2" variants={fieldVariants}>
        <Label htmlFor="travelers">Travelers</Label>
        <Input
          id="travelers"
          type="number"
          min={1}
          max={20}
          disabled={isLoading}
          className="h-11 rounded-xl border-stone-200 bg-stone-50/70"
          aria-invalid={!!errors.travelers}
          aria-describedby={errors.travelers ? "travelers-error" : undefined}
          {...register("travelers", { valueAsNumber: true })}
        />
        {errors.travelers && (
          <p id="travelers-error" className="text-xs text-destructive">
            {errors.travelers.message}
          </p>
        )}
      </motion.div>

      <motion.div className="space-y-2" variants={fieldVariants}>
        <Label htmlFor="tourType">Tour Type</Label>
        <Controller
          control={control}
          name="tourType"
          render={({ field }) => (
            <Select
              {...field}
              id="tourType"
              size="large"
              className="w-full"
              disabled={isLoading}
              options={tourTypeOptions}
              status={errors.tourType ? "error" : undefined}
            />
          )}
        />
        {errors.tourType && <p className="text-xs text-destructive">{errors.tourType.message}</p>}
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
                const nextTravelDates: [string, string] | undefined =
                  dates?.[0] && dates?.[1] ? [dates[0].toISOString(), dates[1].toISOString()] : undefined;
                const nextTripLength = calculateTripLength(nextTravelDates);

                if (nextTripLength.days) {
                  setValue("days", nextTripLength.days, { shouldValidate: true });
                }

                field.onChange(nextTravelDates);
              }}
              onBlur={field.onBlur}
              showTime={{ format: "HH:mm", minuteStep: 15 }}
              format="MMM D, YYYY HH:mm"
              placeholder={["Arrival date and time", "Departure date and time"]}
              size="large"
              className="w-full"
              disabled={isLoading}
              status={errors.travelDates ? "error" : undefined}
              allowClear={false}
            />
          )}
        />
        {errors.travelDates && <p className="text-xs text-destructive">{errors.travelDates.message}</p>}
        <div className="flex min-h-11 items-center rounded-2xl border border-primary/25 bg-primary-soft px-3 text-sm text-foreground">
          <span className="font-semibold">Trip length:&nbsp;</span>
          {tripLength.days
            ? `${tripLength.days} ${tripLength.days === 1 ? "day" : "days"} / ${tripLength.nights} ${
                tripLength.nights === 1 ? "night" : "nights"
              }`
            : "Select valid travel dates"}
        </div>
        {errors.days && <p className="text-xs text-destructive">{errors.days.message}</p>}
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
    </motion.div>
  );
}
