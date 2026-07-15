"use client";

import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigProvider } from "antd";
import { motion } from "framer-motion";
import {
  tripFormSchema,
  type TripFormSchema,
} from "@/lib/validations/tripFormSchema";
import type { TripFormData, TripInterest } from "@/types/trip";
import { ContactDetailsStep } from "./form/ContactDetailsStep";
import { GenerationLoadingModal } from "./form/GenerationLoadingModal";
import { TravelPreferencesStep } from "./form/TravelPreferencesStep";
import { TripBasicsStep } from "./form/TripBasicsStep";
import { TripPlannerNavigation } from "./form/TripPlannerNavigation";
import { STEP_CONTENT, STEP_FIELDS, formVariants, fieldVariants, type FormStep } from "./form/tripPlannerForm.constants";
import { calculateTripLength, defaultTravelDates } from "./form/tripPlannerForm.utils";
import { FormStepIndicator } from "./FormStepIndicator";

interface TripPlannerFormProps {
  isLoading: boolean;
  onSubmit: (data: TripFormData) => Promise<void>;
  onCancel: () => void;
}

export function TripPlannerForm({ isLoading, onSubmit, onCancel }: TripPlannerFormProps) {
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
  const budget = watch("budget");
  const travelStyle = watch("travelStyle");
  const tripLength = useMemo(() => calculateTripLength(selectedTravelDates), [selectedTravelDates]);
  const selectedInterestLabels = useMemo(() => selectedInterests.join(", ") || "None yet", [selectedInterests]);
  const stepConfig = STEP_CONTENT[currentStep];
  const currentStepFields = STEP_FIELDS[currentStep];
  const progressPercentage = Math.round((currentStep / 3) * 100);

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
      <motion.form
        className="space-y-7"
        initial="hidden"
        animate="visible"
        variants={formVariants}
        onSubmit={handleSubmit(handleFormSubmit)}
        aria-hidden={isLoading || undefined}
      >
        <motion.div variants={fieldVariants}>
          <FormStepIndicator currentStep={currentStep} progressPercentage={progressPercentage} />
        </motion.div>

        <motion.div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4" variants={fieldVariants}>
          <h3 className="font-serif text-2xl font-semibold tracking-normal text-foreground">{stepConfig.title}</h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">{stepConfig.description}</p>
        </motion.div>

        {currentStep === 1 && (
          <TripBasicsStep
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            isLoading={isLoading}
            tripLength={tripLength}
          />
        )}

        {currentStep === 2 && (
          <TravelPreferencesStep
            control={control}
            errors={errors}
            isLoading={isLoading}
            selectedInterests={selectedInterests}
            selectedInterestLabels={selectedInterestLabels}
            budget={budget}
            travelStyle={travelStyle}
            onInterestToggle={handleInterestToggle}
            onBudgetChange={handleBudgetChange}
            onTravelStyleChange={handleTravelStyleChange}
          />
        )}

        {currentStep === 3 && (
          <ContactDetailsStep control={control} register={register} errors={errors} isLoading={isLoading} />
        )}

        <TripPlannerNavigation
          currentStep={currentStep}
          isLoading={isLoading}
          canSubmit={selectedInterests.length > 0}
          onBack={handleBack}
          onNext={handleNext}
        />
      </motion.form>

      <GenerationLoadingModal isOpen={isLoading} onCancel={onCancel} />
    </ConfigProvider>
  );
}
