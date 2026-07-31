"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigProvider, DatePicker, Select } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import {
  tripFormSchema,
  type TripFormSchema,
} from "@/lib/validations/tripFormSchema";
import { calculateTripLength } from "@/components/trip-planner/form/tripPlannerForm.utils";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import {
  airportOptions,
  budgetOptions,
  interestOptions,
  preferredCityOptions,
  tourTypeOptions,
  travelStyleOptions,
  travelerOptions,
} from "@/constants/trip-options";
import { cn } from "@/lib/utils";

const { RangePicker } = DatePicker;

type FieldName = keyof TripFormSchema;

const STEP_ORDER: FieldName[][] = [
  ["travelers"],
  ["tourType"],
  ["travelDates"],
  ["arrivalAirport", "departureAirport"],
  ["interests"],
  ["budget"],
  ["travelStyle"],
  ["preferredCities"],
  ["email"],
  ["mobileNumber"],
];

const TOTAL_STEPS = STEP_ORDER.length + 1;

const controlTheme = {
  token: {
    colorBgContainer: "rgba(255,255,255,0.08)",
    colorBgElevated: "#ffffff",
    colorBorder: "rgba(113, 246, 255, 0.2)",
    colorText: "#000000",
    colorTextPlaceholder: "rgba(0,0,0,0.45)",
    colorTextLightSolid: "#ffffff",
    colorPrimary: "#262626",
    controlItemBgActive: "rgba(0,0,0,0.08)",
    controlItemBgHover: "rgba(0,0,0,0.05)",
    colorPrimaryBg: "rgba(0,0,0,0.08)",
    colorPrimaryBgHover: "rgba(0,0,0,0.12)",
    borderRadius: 14,
    controlHeightLG: 48,
    fontFamily: "inherit",
  },
};

function ChipGroup<T extends string>({
  options,
  isSelected,
  onSelect,
  error,
  columns = 2,
  stepIndex,
}: {
  options: { label: string; value: T; description?: string }[];
  isSelected: (value: T) => boolean;
  onSelect: (value: T) => void;
  error?: boolean;
  columns?: 2 | 3;
  stepIndex?: number | null;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        stepIndex === 4 ? "grid-cols-2" : "",
        columns === 3 ? " sm:grid-cols-3" : "sm:grid-cols-2",
        error && "ring-2 ring-red-600/60 ring-offset-2 rounded-2xl",
      )}
    >
      {options?.map((option) => {
        const selected = isSelected(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-2xl border px-4 py-3 text-left text-sm font-medium text-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60",
              selected
                ? "border-white bg-white/25"
                : "border-white/25 bg-white/[0.06] hover:bg-white/15",
            )}
          >
            <p>{option.label}</p>
            {option.description && (
              <p className="mt-1 text-xs font-normal leading-5 text-black/65">
                {option.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function HeroTripPlanner() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<TripFormSchema>({
    resolver: zodResolver(tripFormSchema),
    mode: "onChange",
    defaultValues: {
      days: undefined,
      travelDates: undefined,
      arrivalAirport: undefined,
      departureAirport: undefined,
      preferredCities: [],
      interests: [],
      budget: undefined,
      travelStyle: undefined,
      tourType: undefined,
      travelers: undefined,
      email: "",
      mobileNumber: "",
      tourDescription: "",
    },
  });

  const { status, error, shareId, generateItinerary } = useItineraryGenerator();
  const isLoading = status === "loading";

  useEffect(() => {
    if (status === "success" && shareId) {
      router.push(`/itinerary/${shareId}`);
    }
  }, [status, shareId, router]);

  const currentStepFields = STEP_ORDER[stepIndex];
  const currentField = currentStepFields[0];
  const isLastField = stepIndex === STEP_ORDER.length - 1;
  const travelDates = watch("travelDates");
  const interests = watch("interests");
  const tripLength = useMemo(
    () => calculateTripLength(travelDates),
    [travelDates],
  );

  const onFormSubmit = useCallback(
    async (data: TripFormSchema) => {
      const calculatedTripLength = calculateTripLength(data.travelDates);
      await generateItinerary({
        ...data,
        days: calculatedTripLength.days ?? data.days,
      });
    },
    [generateItinerary],
  );

  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  const handleNext = useCallback(async () => {
    const isValid = await trigger(currentStepFields as Path<TripFormSchema>[]);
    if (!isValid) return;

    if (isLastField) {
      await handleSubmit(onFormSubmit)();
      return;
    }

    setStepIndex((prev) => Math.min(prev + 1, STEP_ORDER.length - 1));
  }, [currentStepFields, trigger, isLastField, handleSubmit, onFormSubmit]);

  const handleBack = useCallback(() => {
    if (stepIndex === 0) {
      setStarted(false);
      return;
    }
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, [stepIndex]);

  const fieldError =
    currentStepFields.length === 1 ? errors[currentField] : undefined;

  return (
    <ConfigProvider theme={controlTheme}>
      <motion.div
        layout
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-[701px] overflow-hidden rounded-[44px] border-[3px] border-white bg-white/[0.06] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] backdrop-blur-[10px] max-md:w-[calc(100vw_-_48px)]"
      >
        <div className="flex flex-col p-6 md:p-7">
          <AnimatePresence mode="wait">
            {!started ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[156px] flex-col justify-between gap-4"
              >
                <textarea
                  {...register("tourDescription")}
                  rows={3}
                  maxLength={1000}
                  placeholder="I'm planning a 7-day trip to Georgia in October. I love food, hidden cafes, scenic hikes, and want to avoid crowds...."
                  className="w-full resize-none rounded-2xl bg-transparent text-lg leading-relaxed text-black placeholder:text-black/50 focus:placeholder:text-transparent focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleStart}
                    className="flex h-14 w-[156px] cursor-pointer items-center justify-center rounded-[44px] border-none bg-black font-sans text-base font-medium uppercase tracking-[0.02em] text-[#fafafa] shadow-[0_0_2px_0_rgba(0,0,0,0.05)] transition-all hover:bg-[#333] active:scale-95"
                  >
                    Plan My Trip
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentField}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[220px] flex-col gap-5 "
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-black/60">
                  <span>
                    Step {stepIndex + 1} / {TOTAL_STEPS - 1}
                  </span>
                  <span className="hidden sm:inline">
                    Plan your Georgia trip
                  </span>
                </div>
                <div className="flex-1 transition-all transform duration-500">
                  {currentField === "travelers" && (
                    <Field label="How many travelers?">
                      <Select
                        size="large"
                        className="w-full"
                        options={travelerOptions}
                        value={watch("travelers")}
                        onChange={(value) =>
                          setValue("travelers", value, { shouldValidate: true })
                        }
                        placeholder="Select number of travelers"
                        status={errors.travelers ? "error" : undefined}
                      />
                    </Field>
                  )}

                  {currentField === "tourType" && (
                    <Field label="What kind of tour?">
                      <ChipGroup
                        options={tourTypeOptions}
                        isSelected={(value) => watch("tourType") === value}
                        onSelect={(value) =>
                          setValue("tourType", value, { shouldValidate: true })
                        }
                        error={!!errors.tourType}
                        stepIndex={stepIndex}
                      />
                    </Field>
                  )}

                  {currentField === "travelDates" && (
                    <Field label="When are you traveling?">
                      <RangePicker
                        size="large"
                        className="w-full"
                        value={
                          travelDates?.length === 2
                            ? [dayjs(travelDates[0]), dayjs(travelDates[1])]
                            : null
                        }
                        onChange={(dates) => {
                          const nextDates: [string, string] | undefined =
                            dates?.[0] && dates?.[1]
                              ? [dates[0].toISOString(), dates[1].toISOString()]
                              : undefined;
                          const nextTripLength = calculateTripLength(nextDates);
                          if (nextTripLength.days) {
                            setValue("days", nextTripLength.days, {
                              shouldValidate: true,
                            });
                          }
                          setValue(
                            "travelDates",
                            nextDates as TripFormSchema["travelDates"],
                            { shouldValidate: true },
                          );
                        }}
                        showTime={{ format: "HH:mm", minuteStep: 15 }}
                        format="MMM D, YYYY HH:mm"
                        placeholder={[
                          "Arrival date and time",
                          "Departure date and time",
                        ]}
                        allowClear={false}
                        status={errors.travelDates ? "error" : undefined}
                      />
                      {tripLength.days && (
                        <p className="mt-2 text-sm text-black/70">
                          Trip length: {tripLength.days}{" "}
                          {tripLength.days === 1 ? "day" : "days"} /{" "}
                          {tripLength.nights}{" "}
                          {tripLength.nights === 1 ? "night" : "nights"}
                        </p>
                      )}
                    </Field>
                  )}

                  {currentField === "arrivalAirport" && (
                    <Field label="Arrival & departure airports">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-black/70">
                            Arrival airport
                          </p>
                          <Select
                            size="large"
                            className="w-full"
                            options={airportOptions}
                            value={watch("arrivalAirport")}
                            onChange={(value) =>
                              setValue("arrivalAirport", value, {
                                shouldValidate: true,
                              })
                            }
                            placeholder="Select arrival airport"
                            status={errors.arrivalAirport ? "error" : undefined}
                          />
                          {errors.arrivalAirport && (
                            <p className="text-sm text-red-600">
                              {errors.arrivalAirport.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-black/70">
                            Departure airport
                          </p>
                          <Select
                            size="large"
                            className="w-full"
                            options={airportOptions}
                            value={watch("departureAirport")}
                            onChange={(value) =>
                              setValue("departureAirport", value, {
                                shouldValidate: true,
                              })
                            }
                            placeholder="Select departure airport"
                            status={
                              errors.departureAirport ? "error" : undefined
                            }
                          />
                          {errors.departureAirport && (
                            <p className="text-sm text-red-600">
                              {errors.departureAirport.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </Field>
                  )}

                  {currentField === "interests" && (
                    <Field label="What are you interested in? (max 5)">
                      <ChipGroup
                        columns={3}
                        options={interestOptions}
                        isSelected={(value) => interests.includes(value)}
                        onSelect={(value) => {
                          const exists = interests.includes(value);
                          if (exists) {
                            setValue(
                              "interests",
                              interests.filter((item) => item !== value),
                              { shouldValidate: true },
                            );
                            return;
                          }
                          if (interests.length >= 5) return;
                          setValue("interests", [...interests, value], {
                            shouldValidate: true,
                          });
                        }}
                        error={!!errors.interests}
                        stepIndex={stepIndex}
                      />
                    </Field>
                  )}

                  {currentField === "budget" && (
                    <Field label="What's your budget?">
                      <ChipGroup
                        columns={3}
                        options={budgetOptions}
                        isSelected={(value) => watch("budget") === value}
                        onSelect={(value) =>
                          setValue("budget", value, { shouldValidate: true })
                        }
                        error={!!errors.budget}
                        stepIndex={stepIndex}
                      />
                    </Field>
                  )}

                  {currentField === "travelStyle" && (
                    <Field label="What travel style fits you?">
                      <ChipGroup
                        columns={3}
                        options={travelStyleOptions}
                        isSelected={(value) => watch("travelStyle") === value}
                        onSelect={(value) =>
                          setValue("travelStyle", value, {
                            shouldValidate: true,
                          })
                        }
                        error={!!errors.travelStyle}
                        stepIndex={stepIndex}
                      />
                    </Field>
                  )}

                  {currentField === "preferredCities" && (
                    <Field label="Preferred overnight cities (up to 6)">
                      <Select
                        mode="multiple"
                        size="large"
                        className="w-full"
                        maxTagCount="responsive"
                        options={preferredCityOptions}
                        value={watch("preferredCities")}
                        onChange={(value) =>
                          setValue("preferredCities", value, {
                            shouldValidate: true,
                          })
                        }
                        placeholder="Choose cities for overnight stays"
                        status={errors.preferredCities ? "error" : undefined}
                      />
                    </Field>
                  )}

                  {currentField === "email" && (
                    <Field label="Your email">
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-2xl border border-white/25 bg-white/[0.06] px-4 text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black/60"
                        {...register("email")}
                      />
                    </Field>
                  )}

                  {currentField === "mobileNumber" && (
                    <Field label="Mobile number (optional)">
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="+995 555 12 34 56"
                        className="h-12 w-full rounded-2xl border border-white/25 bg-white/[0.06] px-4 text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black/60"
                        {...register("mobileNumber")}
                      />
                    </Field>
                  )}

                  {fieldError && (
                    <p className="mt-2 text-sm text-red-600">
                      {fieldError.message as string}
                    </p>
                  )}

                  {isLastField && status === "error" && error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isLoading}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-black/40 text-black transition hover:bg-white/10 disabled:opacity-50"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="flex h-14 min-w-[156px] cursor-pointer items-center justify-center gap-2 rounded-[44px] border-none bg-black px-6 font-sans text-base font-medium uppercase tracking-[0.02em] text-[#fafafa] shadow-[0_0_2px_0_rgba(0,0,0,0.05)] transition-all hover:bg-[#333] active:scale-95 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isLastField ? (
                      "Generate My Trip"
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </ConfigProvider>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-lg font-medium text-black">{label}</p>
      {children}
    </div>
  );
}
