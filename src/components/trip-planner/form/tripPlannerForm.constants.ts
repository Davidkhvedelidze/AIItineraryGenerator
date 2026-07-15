import type { Variants } from "framer-motion";
import type { TripFormSchema } from "@/lib/validations/tripFormSchema";

export type FormStep = 1 | 2 | 3;

export const STEP_FIELDS: Record<FormStep, (keyof TripFormSchema)[]> = {
  1: ["travelers", "travelDates", "arrivalAirport", "departureAirport", "tourType"],
  2: ["interests", "budget", "travelStyle", "preferredCities", "language"],
  3: ["email", "mobileNumber", "tourDescription"],
};

export const STEP_CONTENT: Record<FormStep, { title: string; description: string }> = {
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

export const formVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
};
