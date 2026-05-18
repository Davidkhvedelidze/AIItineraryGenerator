"use client";

import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigProvider, DatePicker, Input as AntInput, Select } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  airportOptions,
  languageOptions,
  preferredCityOptions,
  tourTypeOptions,
} from "@/constants/trip-options";
import {
  tripFormSchema,
  type TripFormSchema,
} from "@/lib/validations/tripFormSchema";
import type { TripFormData, TripInterest } from "@/types/trip";
import { BudgetSelector } from "./BudgetSelector";
import { FormStepIndicator } from "./FormStepIndicator";
import { InterestSelector } from "./InterestSelector";
import { TravelStyleSelector } from "./TravelStyleSelector";

interface TripPlannerFormProps {
  isLoading: boolean;
  onSubmit: (data: TripFormData) => Promise<void>;
}

type FormStep = 1 | 2 | 3;

const STEP_FIELDS: Record<FormStep, (keyof TripFormSchema)[]> = {
  1: [
    "travelers",
    "travelDates",
    "arrivalAirport",
    "departureAirport",
    "tourType",
  ],
  2: ["interests", "budget", "travelStyle", "preferredCities", "language"],
  3: ["email", "mobileNumber", "tourDescription"],
};

const STEP_CONTENT: Record<
  FormStep,
  {
    title: string;
    description: string;
  }
> = {
  1: {
    title: "Trip Basics",
    description: "Tell us when and how you are arriving in Georgia.",
  },
  2: {
    title: "Travel Preferences",
    description: "Choose what kind of Georgia trip you want.",
  },
  3: {
    title: "Contact & Notes",
    description: "Leave your contact details so we can help you organize the trip.",
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
};

const { RangePicker } = DatePicker;
const defaultDepartureDate = dayjs().add(14, "day").hour(10).minute(0).second(0).millisecond(0);
const defaultArrivalDate = defaultDepartureDate.add(5, "day").hour(18).minute(0).second(0).millisecond(0);
const defaultTravelDates: [string, string] = [defaultDepartureDate.toISOString(), defaultArrivalDate.toISOString()];

function calculateTripLength(travelDates?: [string, string]) {
  if (!travelDates?.[0] || !travelDates?.[1]) return { days: null, nights: null };
  const departureDate = dayjs(travelDates[0]);
  const arrivalDate = dayjs(travelDates[1]);
  if (!departureDate.isValid() || !arrivalDate.isValid() || !arrivalDate.isAfter(departureDate)) {
    return { days: null, nights: null };
  }
  const nights = Math.max(0, arrivalDate.startOf("day").diff(departureDate.startOf("day"), "day"));
  return { days: nights + 1, nights };
}

export function TripPlannerForm({ isLoading, onSubmit }: TripPlannerFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const defaultTripLength = calculateTripLength(defaultTravelDates);

  const { register, control, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm<TripFormSchema>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      days: defaultTripLength.days ?? 1,
      travelDates: defaultTravelDates,
      arrivalAirport: "Tbilisi International Airport",
      departureAirport: "Tbilisi International Airport",
      preferredCities: ["Tbilisi"],
      interests: ["culture"],
      budget: "medium",
      travelStyle: "balanced",
      tourType: "private-guided",
      travelers: 2,
      language: "English",
      email: "",
      mobileNumber: "",
      tourDescription: "",
    },
  });

  const selectedInterests = watch("interests");
  const selectedTravelDates = watch("travelDates");
  const tripLength = useMemo(() => calculateTripLength(selectedTravelDates), [selectedTravelDates]);
  const selectedInterestLabels = useMemo(() => selectedInterests.join(", ") || "None yet", [selectedInterests]);
  const stepConfig = useMemo(() => STEP_CONTENT[currentStep], [currentStep]);
  const currentStepFields = useMemo(() => STEP_FIELDS[currentStep], [currentStep]);
  const progressPercentage = useMemo(() => Math.round((currentStep / 3) * 100), [currentStep]);

  const handleInterestToggle = useCallback((interest: TripInterest) => {
    const current = watch("interests");
    const exists = current.includes(interest);
    if (exists) {
      setValue("interests", current.filter((item) => item !== interest), { shouldValidate: true });
      return;
    }
    if (current.length >= 5) return;
    setValue("interests", [...current, interest], { shouldValidate: true });
  }, [setValue, watch]);

  const handleBudgetChange = useCallback((value: TripFormData["budget"]) => {
    setValue("budget", value, { shouldValidate: true });
  }, [setValue]);

  const handleTravelStyleChange = useCallback((value: TripFormData["travelStyle"]) => {
    setValue("travelStyle", value, { shouldValidate: true });
  }, [setValue]);

  const handleNext = useCallback(async () => {
    const isStepValid = await trigger(currentStepFields);
    if (!isStepValid) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3) as FormStep);
  }, [currentStepFields, trigger]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as FormStep);
  }, []);

  const handleFormSubmit = useCallback(async (data: TripFormSchema) => {
    const calculatedTripLength = calculateTripLength(data.travelDates);
    await onSubmit({ ...data, days: calculatedTripLength.days ?? data.days });
  }, [onSubmit]);

  return (
    <ConfigProvider theme={{ token: { borderRadius: 16, colorPrimary: "#F5B700", colorPrimaryHover: "#D99A00", colorSuccess: "#B45309", colorInfo: "#D99A00", colorBorder: "#d8cdbb", controlHeightLG: 46, fontFamily: "inherit" } }}>
      <motion.form className="space-y-7" initial="hidden" animate="visible" variants={formVariants} onSubmit={handleSubmit(handleFormSubmit)}>
        <motion.div variants={fieldVariants}>
          <FormStepIndicator currentStep={currentStep} progressPercentage={progressPercentage} />
        </motion.div>

        <motion.div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4" variants={fieldVariants}>
          <h3 className="font-serif text-2xl font-semibold tracking-normal text-foreground">{stepConfig.title}</h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">{stepConfig.description}</p>
        </motion.div>

        {currentStep === 1 && (
          <motion.div className="grid gap-4 sm:grid-cols-2" variants={formVariants}>
            {/* step 1 fields */}
            <motion.div className="space-y-2" variants={fieldVariants}><Label htmlFor="travelers">Travelers</Label><Input id="travelers" type="number" min={1} max={20} disabled={isLoading} className="h-11 rounded-xl border-stone-200 bg-stone-50/70" {...register("travelers", { valueAsNumber: true })} />{errors.travelers && <p className="text-xs text-destructive">{errors.travelers.message}</p>}</motion.div>
            <motion.div className="space-y-2" variants={fieldVariants}><Label htmlFor="tourType">Tour Type</Label><Controller control={control} name="tourType" render={({ field }) => (<Select {...field} id="tourType" size="large" className="w-full" disabled={isLoading} options={tourTypeOptions} status={errors.tourType ? "error" : undefined} />)} />{errors.tourType && <p className="text-xs text-destructive">{errors.tourType.message}</p>}</motion.div>
            <motion.div className="space-y-2 sm:col-span-2" variants={fieldVariants}><Label htmlFor="travelDates">Travel Dates</Label><Controller control={control} name="travelDates" render={({ field }) => (<RangePicker id="travelDates" value={field.value?.length === 2 ? [dayjs(field.value[0]), dayjs(field.value[1])] : null} onChange={(dates) => {const nextTravelDates: [string, string] | undefined = dates?.[0] && dates?.[1] ? [dates[0].toISOString(), dates[1].toISOString()] : undefined; const nextTripLength = calculateTripLength(nextTravelDates); if (nextTripLength.days) setValue("days", nextTripLength.days, { shouldValidate: true }); field.onChange(nextTravelDates);}} onBlur={field.onBlur} showTime={{ format: "HH:mm", minuteStep: 15 }} format="MMM D, YYYY HH:mm" size="large" className="w-full" disabled={isLoading} status={errors.travelDates ? "error" : undefined} allowClear={false} />)} />{errors.travelDates && <p className="text-xs text-destructive">{errors.travelDates.message}</p>}<div className="flex min-h-11 items-center rounded-2xl border border-primary/25 bg-primary-soft px-3 text-sm text-foreground"><span className="font-semibold">Trip length:&nbsp;</span>{tripLength.days ? `${tripLength.days} ${tripLength.days === 1 ? "day" : "days"} / ${tripLength.nights} ${tripLength.nights === 1 ? "night" : "nights"}` : "Select valid travel dates"}</div>{errors.days && <p className="text-xs text-destructive">{errors.days.message}</p>}</motion.div>
            <motion.div className="space-y-2" variants={fieldVariants}><Label htmlFor="arrivalAirport">Arrival Airport</Label><Controller control={control} name="arrivalAirport" render={({ field }) => (<Select {...field} id="arrivalAirport" size="large" className="w-full" disabled={isLoading} options={airportOptions} status={errors.arrivalAirport ? "error" : undefined} />)} />{errors.arrivalAirport && <p className="text-xs text-destructive">{errors.arrivalAirport.message}</p>}</motion.div>
            <motion.div className="space-y-2" variants={fieldVariants}><Label htmlFor="departureAirport">Departure Airport</Label><Controller control={control} name="departureAirport" render={({ field }) => (<Select {...field} id="departureAirport" size="large" className="w-full" disabled={isLoading} options={airportOptions} status={errors.departureAirport ? "error" : undefined} />)} />{errors.departureAirport && <p className="text-xs text-destructive">{errors.departureAirport.message}</p>}</motion.div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div className="space-y-6" variants={formVariants}>
            <motion.div className="space-y-2" variants={fieldVariants}><Label>Interests (max 5)</Label><InterestSelector selectedInterests={selectedInterests} onToggle={handleInterestToggle} disabled={isLoading} /><p className="text-xs text-muted-foreground">Selected: {selectedInterestLabels}</p>{errors.interests && <p className="text-xs text-destructive">{errors.interests.message}</p>}</motion.div>
            <motion.div className="space-y-2" variants={fieldVariants}><Label>Budget</Label><BudgetSelector value={watch("budget")} onChange={handleBudgetChange} /></motion.div>
            <motion.div className="space-y-2" variants={fieldVariants}><Label>Travel Style</Label><TravelStyleSelector value={watch("travelStyle")} onChange={handleTravelStyleChange} /></motion.div>
            <motion.div className="space-y-2" variants={fieldVariants}><Label htmlFor="preferredCities">Preferred Overnight Cities</Label><Controller control={control} name="preferredCities" render={({ field }) => (<Select {...field} id="preferredCities" mode="multiple" size="large" className="w-full" disabled={isLoading} maxTagCount="responsive" options={preferredCityOptions} placeholder="Choose cities for overnight stays" status={errors.preferredCities ? "error" : undefined} />)} /><p className="text-xs text-muted-foreground">Choose the cities you would prefer for overnight stays.</p>{errors.preferredCities && <p className="text-xs text-destructive">{errors.preferredCities.message}</p>}</motion.div>
            <motion.div className="space-y-2" variants={fieldVariants}><Label htmlFor="language">Language</Label><Controller control={control} name="language" render={({ field }) => (<Select {...field} id="language" size="large" className="w-full" disabled={isLoading} options={languageOptions} status={errors.language ? "error" : undefined} />)} />{errors.language && <p className="text-xs text-destructive">{errors.language.message}</p>}</motion.div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div className="grid gap-4 sm:grid-cols-2" variants={formVariants}>
            <motion.div className="space-y-2" variants={fieldVariants}><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" autoComplete="email" disabled={isLoading} className="h-11 rounded-xl border-stone-200 bg-stone-50/70" {...register("email")} />{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}</motion.div>
            <motion.div className="space-y-2" variants={fieldVariants}><Label htmlFor="mobileNumber">Mobile Number (optional)</Label><Controller control={control} name="mobileNumber" render={({ field }) => (<AntInput {...field} id="mobileNumber" type="tel" size="large" placeholder="+995 555 12 34 56" autoComplete="tel" disabled={isLoading} status={errors.mobileNumber ? "error" : undefined} />)} />{errors.mobileNumber && <p className="text-xs text-destructive">{errors.mobileNumber.message}</p>}</motion.div>
            <motion.div className="space-y-2 sm:col-span-2" variants={fieldVariants}><Label htmlFor="tourDescription">Tour Description (optional)</Label><Controller control={control} name="tourDescription" render={({ field }) => (<AntInput.TextArea {...field} id="tourDescription" placeholder="For a custom tour, paste overnight schedule, places to include, pace, accessibility needs, hotel style, special occasions, or anything else to personalize the offer." autoSize={{ minRows: 4, maxRows: 7 }} showCount maxLength={1000} disabled={isLoading} required={false} status={errors.tourDescription ? "error" : undefined} />)} />{errors.tourDescription && <p className="text-xs text-destructive">{errors.tourDescription.message}</p>}</motion.div>
            <motion.p className="sm:col-span-2 max-w-3xl text-xs leading-5 text-muted-foreground" variants={fieldVariants}>By submitting this form, you agree that TripMate Georgia can store your contact details and trip preferences to generate your itinerary and follow up about organizing the trip.</motion.p>
          </motion.div>
        )}

        <motion.div className="flex flex-col gap-3 sm:flex-row sm:justify-between" variants={fieldVariants}>
          <Button type="button" variant="outline" className="h-11 rounded-full border-stone-300 px-6 text-foreground hover:bg-stone-50" onClick={handleBack} disabled={isLoading || currentStep === 1}>Back</Button>
          {currentStep < 3 ? (
            <Button type="button" className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-hover" onClick={handleNext} disabled={isLoading}>Continue</Button>
          ) : (
            <Button type="submit" className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-hover" disabled={isLoading || selectedInterests.length === 0}>Generate Custom Itinerary</Button>
          )}
        </motion.div>
      </motion.form>

      {isLoading && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm" role="presentation">
          <motion.div
            aria-describedby="trip-generation-modal-description"
            aria-labelledby="trip-generation-modal-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-amber-100 bg-card p-6 text-center shadow-2xl shadow-yellow-900/20"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-stone-900">
              <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
            </div>
            <h3 id="trip-generation-modal-title" className="text-lg font-semibold">
              Generating your trip plan
            </h3>
            <p id="trip-generation-modal-description" className="mt-2 text-sm leading-6 text-muted-foreground">
              This can take a few minutes while we build a realistic itinerary from your travel dates, interests, and preferences. Please keep this page open.
            </p>
          </motion.div>
        </div>
      )}
    </ConfigProvider>
  );
}
