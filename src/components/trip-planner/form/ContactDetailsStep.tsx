"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Input as AntInput } from "antd";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TripFormSchema } from "@/lib/validations/tripFormSchema";
import { fieldVariants, formVariants } from "./tripPlannerForm.constants";

interface ContactDetailsStepProps {
  control: Control<TripFormSchema>;
  register: UseFormRegister<TripFormSchema>;
  errors: FieldErrors<TripFormSchema>;
  isLoading: boolean;
}

export function ContactDetailsStep({ control, register, errors, isLoading }: ContactDetailsStepProps) {
  return (
    <motion.div className="grid gap-4 sm:grid-cols-2" variants={formVariants}>
      <motion.div className="space-y-2" variants={fieldVariants}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          className="h-11 rounded-xl border-stone-200 bg-stone-50/70"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </motion.div>

      <motion.div className="space-y-2" variants={fieldVariants}>
        <Label htmlFor="mobileNumber">Mobile Number (optional)</Label>
        <Controller
          control={control}
          name="mobileNumber"
          render={({ field }) => (
            <AntInput
              {...field}
              id="mobileNumber"
              type="tel"
              size="large"
              placeholder="+995 555 12 34 56"
              autoComplete="tel"
              disabled={isLoading}
              status={errors.mobileNumber ? "error" : undefined}
            />
          )}
        />
        {errors.mobileNumber && <p className="text-xs text-destructive">{errors.mobileNumber.message}</p>}
      </motion.div>

      <motion.div className="space-y-2 sm:col-span-2" variants={fieldVariants}>
        <Label htmlFor="tourDescription">Tour Description (optional)</Label>
        <Controller
          control={control}
          name="tourDescription"
          render={({ field }) => (
            <AntInput.TextArea
              {...field}
              id="tourDescription"
              placeholder="For a custom tour, paste overnight schedule, places to include, pace, accessibility needs, hotel style, special occasions, or anything else to personalize the offer."
              autoSize={{ minRows: 4, maxRows: 7 }}
              showCount
              maxLength={1000}
              disabled={isLoading}
              required={false}
              status={errors.tourDescription ? "error" : undefined}
            />
          )}
        />
        {errors.tourDescription && <p className="text-xs text-destructive">{errors.tourDescription.message}</p>}
      </motion.div>

      <motion.p className="sm:col-span-2 max-w-3xl text-xs leading-5 text-muted-foreground" variants={fieldVariants}>
        By submitting this form, you agree that TripMate Georgia can store your contact details and trip preferences
        to generate your itinerary and follow up about organizing the trip.
      </motion.p>
    </motion.div>
  );
}
