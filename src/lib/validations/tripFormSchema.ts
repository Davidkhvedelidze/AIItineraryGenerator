import { z } from "zod";

const airportSchema = z.enum(["Tbilisi International Airport", "Kutaisi International Airport", "Batumi International Airport"]);

const preferredCitySchema = z.enum([
  "Tbilisi",
  "Batumi",
  "Kutaisi",
  "Sighnaghi",
  "Telavi",
  "Mtskheta",
  "Stepantsminda",
  "Borjomi",
  "Bakuriani",
  "Mestia",
  "Zugdidi",
  "Ureki",
  "Kobuleti",
  "Akhaltsikhe",
  "Ambrolauri"
]);

const requiredNumber = (label: string, min: number, max: number) =>
  z.preprocess(
    (value) => (value === "" || Number.isNaN(value) ? undefined : value),
    z
      .number({
        required_error: `${label} is required.`,
        invalid_type_error: `${label} must be a number.`
      })
      .int(`${label} must be a whole number.`)
      .min(min, `${label} must be at least ${min}.`)
      .max(max, `${label} must be ${max} or less.`)
  );

export const tripFormSchema = z.object({
  days: requiredNumber("Trip length", 1, 14),
  travelDates: z
    .tuple([
      z.string().datetime("Choose a valid departure date and time."),
      z.string().datetime("Choose a valid arrival date and time.")
    ])
    .refine(([departure, arrival]) => new Date(arrival).getTime() > new Date(departure).getTime(), {
      message: "Arrival must be after departure.",
      path: [1]
    }),
  arrivalAirport: airportSchema,
  departureAirport: airportSchema,
  preferredCities: z
    .array(preferredCitySchema)
    .min(1, "Choose at least one preferred overnight city.")
    .max(6, "Choose up to 6 preferred overnight cities."),
  interests: z.array(z.enum(["mountains", "wine", "food", "history", "culture", "hiking", "sea", "nightlife", "family-friendly", "photography"]))
    .min(1, "Choose at least one interest.")
    .max(5, "Choose up to 5 interests."),
  budget: z.enum(["low", "medium", "premium"]),
  travelStyle: z.enum(["relaxed", "balanced", "active"]),
  travelers: requiredNumber("Travelers", 1, 20),
  language: z.enum(["English", "Georgian"]),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address.")
});

export type TripFormSchema = z.infer<typeof tripFormSchema>;
