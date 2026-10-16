"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ConfigProvider,
  DatePicker,
  type DatePickerProps,
  type GetRef,
  type ThemeConfig,
} from "antd";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Footprints,
  Landmark,
  Loader2,
  Lock,
  Minus,
  Mountain,
  MoonStar,
  Plus,
  Sparkles,
  Theater,
  Users,
  Utensils,
  Waves,
  Wine,
  type LucideIcon,
} from "lucide-react";
import dayjs from "dayjs";
import {
  tripFormSchema,
  type TripFormSchema,
} from "@/lib/validations/tripFormSchema";
import { calculateTripLength } from "@/components/trip-planner/form/tripPlannerForm.utils";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { trackEvent } from "@/lib/analytics";
import {
  airportOptions,
  budgetOptions,
  interestOptions,
  MAX_TRAVELERS,
  preferredCityOptions,
  tourTypeOptions,
  travelStyleOptions,
} from "@/constants/trip-options";
import { cn } from "@/lib/utils";

type FieldName = keyof TripFormSchema;
type Step = "trip" | "contact";
type Panel = "notes" | "advanced";

const MAX_TRIP_DAYS = 14;
const MAX_INTERESTS = 5;
const MAX_CITIES = 6;
const DEFAULT_AIRPORT = "Tbilisi International Airport";
const DEFAULT_CITY = "Tbilisi";

const TRIP_FIELDS: FieldName[] = [
  "travelDates",
  "days",
  "travelers",
  "tourType",
  "interests",
  "budget",
  "travelStyle",
  "arrivalAirport",
  "departureAirport",
  "preferredCities",
  "tourDescription",
];

const ADVANCED_FIELDS: FieldName[] = [
  "arrivalAirport",
  "departureAirport",
  "preferredCities",
];

const INTEREST_ICONS: Record<string, LucideIcon> = {
  Mountain,
  Wine,
  Utensils,
  Landmark,
  Theater,
  Footprints,
  Waves,
  MoonStar,
  Users,
  Camera,
};

const LOADING_MESSAGES = [
  "Reading your travel preferences…",
  "Choosing the best overnight cities…",
  "Planning realistic driving times…",
  "Adding food, wine and viewpoints…",
  "Polishing your day-by-day plan…",
];

const fieldLabelClass =
  "text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground";

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/40 aria-[invalid=true]:border-red-600";

const primaryButtonClass =
  "flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// antd derives hover/active shades from real colors, so these mirror the HSL tokens in globals.css.
const datePickerTheme: ThemeConfig = {
  token: {
    colorPrimary: "#292005", // --foreground: selected days match the selected pills
    colorText: "#292005",
    colorTextPlaceholder: "rgba(98, 87, 65, 0.7)", // --muted-foreground/70
    colorBorder: "#e1d7c2", // --border
    colorBgContainer: "#fffdf7", // --background
    colorError: "#dc2626",
    borderRadius: 12,
    borderRadiusLG: 16,
    fontFamily: "inherit",
  },
  components: {
    DatePicker: {
      inputFontSize: 15,
      hoverBorderColor: "rgba(41, 32, 5, 0.4)",
      activeBorderColor: "rgba(41, 32, 5, 0.4)",
      activeShadow: "0 0 0 2px rgba(217, 154, 0, 0.4)", // --ring/40
      cellHoverBg: "#f4efe1", // --muted
    },
  },
};

// The Tailwind classes repeat the final look so the server-rendered field
// doesn't flash unstyled before antd injects its styles on the client.
const datePickerProps = {
  format: "ddd, MMM D",
  inputReadOnly: true,
  allowClear: false,
  suffixIcon: (
    <CalendarDays
      className="h-4 w-4 text-muted-foreground"
      aria-hidden="true"
    />
  ),
  classNames: {
    root: "flex h-14 w-full items-center rounded-xl border border-border bg-background px-3 pb-1 pt-5 sm:px-4 [&_.ant-picker-input]:flex [&_.ant-picker-input]:w-full [&_.ant-picker-input]:items-center",
    input:
      "w-full min-w-0 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70",
  },
} satisfies DatePickerProps;

const dateLabelClass =
  "pointer-events-none absolute left-3 top-1.5 z-10 text-[11px] font-medium text-muted-foreground sm:left-4";

const linkButtonClass =
  "inline-flex items-center gap-1 font-medium text-secondary-gold underline-offset-4 hover:underline";

/** The API expects ISO datetimes with departure after arrival; the form only asks for days. */
function toTravelDates(arrival: string, departure: string): [string, string] {
  return [
    dayjs(arrival).hour(10).toISOString(),
    dayjs(departure).hour(18).toISOString(),
  ];
}

function firstErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  if (
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }
  for (const value of Object.values(error)) {
    const message = firstErrorMessage(value);
    if (message) return message;
  }
  return undefined;
}

function ErrorText({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-sm text-red-700">
      {children}
    </p>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-muted p-1"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-10 rounded-lg px-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function TravelerStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition hover:bg-card disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Fewer travelers"
        className={buttonClass}
      >
        <Minus className="h-4 w-4" />
      </button>
      <output
        aria-live="polite"
        className="text-sm font-semibold text-foreground"
      >
        {value} {value === 1 ? "traveler" : "travelers"}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_TRAVELERS, value + 1))}
        disabled={value >= MAX_TRAVELERS}
        aria-label="More travelers"
        className={buttonClass}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Pill({
  selected,
  disabled,
  onClick,
  icon: Icon,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:border-foreground/40",
      )}
    >
      {selected ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )
      )}
      {children}
    </button>
  );
}

/**
 * Scrolls `el` to its scroll-margin offset, but only when its top is hidden
 * above the viewport or under the sticky header. ("nearest" ignores
 * scroll-margin for a partly visible element, hence the manual check.)
 */
function revealTop(el: HTMLElement | null) {
  if (!el) return;
  const { scrollMarginTop } = getComputedStyle(el);
  if (el.getBoundingClientRect().top < parseFloat(scrollMarginTop)) {
    el.scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

/**
 * Covers the trip form in place instead of expanding it, so opening extra
 * options never changes the card's height.
 */
function PlannerPanel({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const target =
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
      headingRef.current;
    target?.focus({ preventScroll: true });
    // Opened from further down the form (common on phones).
    revealTop(headingRef.current);
  }, []);

  return (
    <motion.div
      ref={panelRef}
      role="region"
      aria-label={title}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        onClose();
      }}
      className="absolute inset-0 z-10 flex flex-col gap-5 bg-background"
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to trip details"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="space-y-0.5">
          <p
            ref={headingRef}
            tabIndex={-1}
            className="scroll-mt-24 font-serif text-xl font-semibold text-foreground focus:outline-none"
          >
            {title}
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain p-1">
        {children}
      </div>
      <button type="button" onClick={onClose} className={primaryButtonClass}>
        Done
      </button>
    </motion.div>
  );
}

function GeneratingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      key="generating"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
      className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft">
        <Loader2
          className="h-6 w-6 animate-spin text-secondary-gold"
          aria-hidden="true"
        />
      </span>
      <p className="font-serif text-xl font-semibold text-foreground">
        Building your Georgia itinerary
      </p>
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-sm text-muted-foreground"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
      <p className="text-xs text-muted-foreground">
        This usually takes 20–40 seconds. Please keep this page open.
      </p>
    </motion.div>
  );
}

export function HeroTripPlanner() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("trip");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [panel, setPanel] = useState<Panel | null>(null);
  const startTracked = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const notesTriggerRef = useRef<HTMLButtonElement>(null);
  const advancedTriggerRef = useRef<HTMLButtonElement>(null);
  const lastPanel = useRef<Panel | null>(null);
  const departurePickerRef = useRef<GetRef<typeof DatePicker>>(null);
  const [departureOpen, setDepartureOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<TripFormSchema>({
    resolver: zodResolver(tripFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      days: undefined,
      travelDates: undefined,
      arrivalAirport: DEFAULT_AIRPORT,
      departureAirport: DEFAULT_AIRPORT,
      preferredCities: [DEFAULT_CITY],
      interests: [],
      budget: "medium",
      travelStyle: "balanced",
      tourType: "private-guided",
      travelers: 2,
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

  const markStarted = useCallback(() => {
    if (startTracked.current) return;
    startTracked.current = true;
    trackEvent("planner_start");
  }, []);

  const travelDates = watch("travelDates");
  const interests = watch("interests");
  const travelers = watch("travelers");
  const tourType = watch("tourType");
  const preferredCities = watch("preferredCities");
  const arrivalAirport = watch("arrivalAirport");
  const departureAirport = watch("departureAirport");
  const hasNotes = !!watch("tourDescription")?.trim();
  const customRoute =
    arrivalAirport !== DEFAULT_AIRPORT ||
    departureAirport !== DEFAULT_AIRPORT ||
    preferredCities.length !== 1 ||
    preferredCities[0] !== DEFAULT_CITY;
  const tripLength = useMemo(
    () => calculateTripLength(travelDates),
    [travelDates],
  );
  const tooLong = (tripLength.days ?? 0) > MAX_TRIP_DAYS;

  const updateDates = (arrival: string, departure: string) => {
    markStarted();
    setArrivalDate(arrival);
    setDepartureDate(departure);
    if (!arrival || !departure) {
      // Otherwise the previous range would still be submitted (and counted) after a date is cleared.
      // Not resetField: these fields are only ever set directly, never registered, so it'd be a no-op.
      setValue("travelDates", undefined as never);
      setValue("days", undefined as never);
      return;
    }
    const nextDates = toTravelDates(arrival, departure);
    const nextLength = calculateTripLength(nextDates);
    if (nextLength.days) setValue("days", nextLength.days);
    setValue("travelDates", nextDates);
    clearErrors(["travelDates", "days"]);
  };

  // While a panel covers the form, keep keyboard and screen-reader focus out of it.
  // A callback ref so it also applies when the form remounts with a panel open.
  const formContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      node?.toggleAttribute("inert", panel !== null);
    },
    [panel],
  );

  useEffect(() => {
    if (panel) {
      lastPanel.current = panel;
      return;
    }
    const closed = lastPanel.current;
    lastPanel.current = null;
    if (closed === "notes") notesTriggerRef.current?.focus();
    if (closed === "advanced") advancedTriggerRef.current?.focus();
  }, [panel]);

  // Advanced errors are only shown inside the panel, so it stays open until they're fixed.
  const closePanel = async () => {
    if (panel === "advanced") {
      const isValid = await trigger(ADVANCED_FIELDS as Path<TripFormSchema>[]);
      if (!isValid) return;
    }
    setPanel(null);
  };

  const goToStep = useCallback((next: Step) => {
    setStep(next);
    // The steps differ a lot in height: on phones, the short contact step would
    // otherwise leave the user (who pressed Continue far down) below the card.
    revealTop(cardRef.current);
    trackEvent("planner_step_view", {
      step_number: next === "trip" ? 1 : 2,
      step_name: next,
    });
  }, []);

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

  // If anything on the trip screen is still invalid at submit time, send the user
  // back there instead of leaving a button that silently does nothing.
  const onFormInvalid = useCallback(
    (formErrors: FieldErrors<TripFormSchema>) => {
      const invalidFields = Object.keys(formErrors) as FieldName[];
      const tripInvalid = invalidFields.some((field) =>
        TRIP_FIELDS.includes(field),
      );
      trackEvent("planner_validation_error", {
        step_name: tripInvalid ? "trip" : "contact",
        field: invalidFields[0],
      });
      if (!tripInvalid) return;
      if (invalidFields.some((field) => ADVANCED_FIELDS.includes(field))) {
        setPanel("advanced");
      }
      goToStep("trip");
    },
    [goToStep],
  );

  const handleContinue = async () => {
    markStarted();
    const isValid = await trigger(TRIP_FIELDS as Path<TripFormSchema>[]);
    if (!isValid) {
      trackEvent("planner_validation_error", { step_name: "trip" });
      return;
    }
    goToStep("contact");
  };

  const handleGenerate = handleSubmit(onFormSubmit, onFormInvalid);

  const datesError =
    errors.travelDates && (!arrivalDate || !departureDate)
      ? "Choose your arrival and departure dates."
      : (firstErrorMessage(errors.travelDates) ??
        firstErrorMessage(errors.days));

  const advancedError =
    firstErrorMessage(errors.arrivalAirport) ??
    firstErrorMessage(errors.departureAirport) ??
    firstErrorMessage(errors.preferredCities);

  const tourTypeLabel = tourTypeOptions.find(
    (o) => o.value === tourType,
  )?.label;

  return (
    <div
      ref={cardRef}
      className="w-full max-w-[560px] scroll-mt-20 rounded-[28px] border border-border bg-background text-card-foreground shadow-[0_30px_80px_-30px_rgba(60,40,10,0.45)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
        <p className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-foreground">
          <Sparkles
            className="h-4 w-4 text-secondary-gold"
            aria-hidden="true"
          />
          AI trip planner
        </p>
        <ol
          aria-label="Progress"
          className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-muted-foreground"
        >
          {(["trip", "contact"] as const).map((id, index) => (
            <li key={id} className="flex items-center gap-2">
              {index > 0 && (
                <span className="h-px w-4 bg-border" aria-hidden="true" />
              )}
              <span
                aria-current={step === id ? "step" : undefined}
                className={cn(
                  "flex items-center gap-1.5",
                  step === id && "text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                    step === id
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="hidden sm:inline">
                  {id === "trip" ? "Your trip" : "Get plan"}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-5 py-6 sm:px-7">
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <GeneratingState />
          ) : step === "trip" ? (
            <motion.form
              key="trip"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void handleContinue();
              }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div ref={formContentRef} className="flex flex-col gap-6">
                <fieldset className="space-y-2">
                  <legend className={cn(fieldLabelClass, "mb-2")}>
                    Travel dates
                  </legend>
                  <ConfigProvider theme={datePickerTheme}>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <span className={dateLabelClass}>Arrive</span>
                        <DatePicker
                          {...datePickerProps}
                          aria-label="Arrival date"
                          placeholder="Add date"
                          value={arrivalDate ? dayjs(arrivalDate) : null}
                          disabledDate={(day) => day.isBefore(dayjs(), "day")}
                          status={datesError || tooLong ? "error" : undefined}
                          onChange={(date) => {
                            const arrival = date
                              ? date.format("YYYY-MM-DD")
                              : "";
                            const departure =
                              departureDate && departureDate < arrival
                                ? ""
                                : departureDate;
                            updateDates(arrival, departure);
                            // Arrival is usually picked first: go straight on to the departure calendar.
                            // Focus alone doesn't open an antd picker, hence the controlled `open`.
                            if (arrival && !departure) {
                              departurePickerRef.current?.focus();
                              setDepartureOpen(true);
                            }
                          }}
                        />
                      </div>
                      <div className="relative">
                        <span className={dateLabelClass}>Leave</span>
                        <DatePicker
                          {...datePickerProps}
                          ref={departurePickerRef}
                          open={departureOpen}
                          onOpenChange={setDepartureOpen}
                          aria-label="Departure date"
                          placeholder="Add date"
                          placement="bottomRight"
                          value={departureDate ? dayjs(departureDate) : null}
                          defaultPickerValue={
                            arrivalDate ? dayjs(arrivalDate) : undefined
                          }
                          disabledDate={(day) =>
                            day.isBefore(
                              arrivalDate ? dayjs(arrivalDate) : dayjs(),
                              "day",
                            )
                          }
                          status={datesError || tooLong ? "error" : undefined}
                          onChange={(date) =>
                            updateDates(
                              arrivalDate,
                              date ? date.format("YYYY-MM-DD") : "",
                            )
                          }
                        />
                      </div>
                    </div>
                  </ConfigProvider>
                  {tripLength.days && !tooLong && (
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      {tripLength.days} {tripLength.days === 1 ? "day" : "days"}{" "}
                      · {tripLength.nights}{" "}
                      {tripLength.nights === 1 ? "night" : "nights"}
                    </p>
                  )}
                  {tooLong ? (
                    <ErrorText>
                      {`Our AI planner covers trips up to ${MAX_TRIP_DAYS} days. Pick a shorter range, or message us on WhatsApp for a longer custom route.`}
                    </ErrorText>
                  ) : (
                    <ErrorText>{datesError}</ErrorText>
                  )}
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className={fieldLabelClass}>Travelers</p>
                    <TravelerStepper
                      value={travelers ?? 2}
                      onChange={(value) => {
                        markStarted();
                        setValue("travelers", value);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className={fieldLabelClass}>Tour</p>
                    <Segmented
                      label="Tour type"
                      options={tourTypeOptions.map((o) => ({
                        value: o.value,
                        label:
                          o.value === "private-guided" ? "Private" : "Group",
                      }))}
                      value={tourType}
                      onChange={(value) => {
                        markStarted();
                        setValue("tourType", value);
                      }}
                    />
                  </div>
                </div>

                <fieldset className="space-y-2">
                  <legend className={cn(fieldLabelClass, "mb-2")}>
                    What do you love?{" "}
                    <span className="font-normal normal-case tracking-normal">
                      · up to {MAX_INTERESTS}
                    </span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((option) => {
                      const selected = interests.includes(option.value);
                      return (
                        <Pill
                          key={option.value}
                          selected={selected}
                          disabled={
                            !selected && interests.length >= MAX_INTERESTS
                          }
                          icon={
                            option.icon
                              ? INTEREST_ICONS[option.icon]
                              : undefined
                          }
                          onClick={() => {
                            markStarted();
                            setValue(
                              "interests",
                              selected
                                ? interests.filter(
                                    (item) => item !== option.value,
                                  )
                                : [...interests, option.value],
                            );
                            if (!selected) clearErrors("interests");
                          }}
                        >
                          {option.label}
                        </Pill>
                      );
                    })}
                  </div>
                  <ErrorText>{errors.interests?.message}</ErrorText>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className={fieldLabelClass}>Budget</p>
                    <Segmented
                      label="Budget"
                      options={budgetOptions}
                      value={watch("budget")}
                      onChange={(value) => setValue("budget", value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className={fieldLabelClass}>Pace</p>
                    <Segmented
                      label="Travel pace"
                      options={travelStyleOptions}
                      value={watch("travelStyle")}
                      onChange={(value) => setValue("travelStyle", value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <button
                    ref={notesTriggerRef}
                    type="button"
                    onClick={() => setPanel("notes")}
                    className={linkButtonClass}
                  >
                    {hasNotes ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {hasNotes ? "Edit note" : "Add a note"}
                  </button>
                  <button
                    ref={advancedTriggerRef}
                    type="button"
                    onClick={() => setPanel("advanced")}
                    className={linkButtonClass}
                  >
                    {customRoute ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    Airports & cities
                    {customRoute && ` · ${preferredCities.length}`}
                  </button>
                </div>

                <button type="submit" className={primaryButtonClass}>
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="-mt-2 text-center text-xs text-muted-foreground">
                  Free · No account needed · Ready in about 30 seconds
                </p>
              </div>

              <AnimatePresence>
                {panel === "notes" && (
                  <PlannerPanel
                    key="notes"
                    title="Add a note"
                    description="Anything our planner should know about your trip."
                    onClose={() => void closePanel()}
                  >
                    <label htmlFor="planner-notes-input" className="sr-only">
                      Notes for your trip
                    </label>
                    <textarea
                      id="planner-notes-input"
                      data-autofocus
                      {...register("tourDescription")}
                      rows={6}
                      maxLength={1000}
                      placeholder="E.g. traveling with kids, want to avoid long drives, love hidden cafes…"
                      className={cn(inputClass, "h-auto resize-none py-3")}
                    />
                  </PlannerPanel>
                )}

                {panel === "advanced" && (
                  <PlannerPanel
                    key="advanced"
                    title="Airports & cities"
                    description="Optional. We'll plan the best route around them."
                    onClose={() => void closePanel()}
                  >
                    <div className="space-y-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(["arrivalAirport", "departureAirport"] as const).map(
                          (name) => (
                            <label key={name} className="block space-y-1.5">
                              <span className="block text-sm font-medium text-foreground">
                                {name === "arrivalAirport"
                                  ? "Arrival airport"
                                  : "Departure airport"}
                              </span>
                              <select
                                {...register(name)}
                                className={inputClass}
                              >
                                {airportOptions.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label.replace(
                                      " International Airport",
                                      "",
                                    )}
                                  </option>
                                ))}
                              </select>
                            </label>
                          ),
                        )}
                      </div>
                      <fieldset className="space-y-2">
                        <legend className="mb-2 text-sm font-medium text-foreground">
                          Must-stay cities{" "}
                          <span className="font-normal text-muted-foreground">
                            · up to {MAX_CITIES}, we&apos;ll plan the rest
                          </span>
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {preferredCityOptions.map((option) => {
                            const selected = preferredCities.includes(
                              option.value,
                            );
                            return (
                              <Pill
                                key={option.value}
                                selected={selected}
                                disabled={
                                  !selected &&
                                  preferredCities.length >= MAX_CITIES
                                }
                                onClick={() =>
                                  setValue(
                                    "preferredCities",
                                    selected
                                      ? preferredCities.filter(
                                          (city) => city !== option.value,
                                        )
                                      : [...preferredCities, option.value],
                                    { shouldValidate: true },
                                  )
                                }
                              >
                                {option.label}
                              </Pill>
                            );
                          })}
                        </div>
                      </fieldset>
                      <ErrorText>{advancedError}</ErrorText>
                    </div>
                  </PlannerPanel>
                )}
              </AnimatePresence>
            </motion.form>
          ) : (
            <motion.form
              key="contact"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void handleGenerate();
              }}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div className="flex items-start justify-between gap-3 rounded-2xl bg-muted px-4 py-3">
                <div className="space-y-0.5 text-sm">
                  <p className="font-semibold text-foreground">
                    {dayjs(arrivalDate).format("MMM D")} –{" "}
                    {dayjs(departureDate).format("MMM D")}
                    {tripLength.days ? ` · ${tripLength.days} days` : ""}
                  </p>
                  <p className="text-muted-foreground">
                    {travelers} {travelers === 1 ? "traveler" : "travelers"}
                    {tourTypeLabel ? ` · ${tourTypeLabel}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => goToStep("trip")}
                  className={cn(linkButtonClass, "shrink-0 text-sm")}
                >
                  Edit
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-semibold text-foreground">
                  Where should we send your plan?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your itinerary opens right after this. We use your contact
                  only to help with your trip.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="block text-sm font-medium text-foreground">
                    Email
                  </span>
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    className={inputClass}
                    {...register("email")}
                  />
                  <ErrorText>{errors.email?.message}</ErrorText>
                </label>
                <label className="block space-y-1.5">
                  <span className="block text-sm font-medium text-foreground">
                    WhatsApp{" "}
                    <span className="font-normal text-muted-foreground">
                      · optional, for driver & booking questions
                    </span>
                  </span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+966 5X XXX XXXX"
                    aria-invalid={!!errors.mobileNumber}
                    className={inputClass}
                    {...register("mobileNumber")}
                  />
                  <ErrorText>{errors.mobileNumber?.message}</ErrorText>
                </label>
              </div>

              {status === "error" && <ErrorText>{error}</ErrorText>}

              <div className="space-y-3">
                <button type="submit" className={primaryButtonClass}>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Generate my itinerary
                </button>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep("trip")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                  </button>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    No spam, ever.
                  </p>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
