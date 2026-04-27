import { z } from "zod";

export const tripFormSchema = z.object({
  days: z.number().min(1).max(14),
  month: z.string().min(1),
  startingCity: z.enum(["Tbilisi", "Kutaisi", "Batumi"]),
  interests: z.array(z.enum(["mountains", "wine", "food", "history", "culture", "hiking", "sea", "nightlife", "family-friendly", "photography"]))
    .min(1)
    .max(5),
  budget: z.enum(["low", "medium", "premium"]),
  travelStyle: z.enum(["relaxed", "balanced", "active"]),
  travelers: z.number().min(1).max(20),
  language: z.enum(["English", "Georgian"]),
  email: z.union([z.string().email(), z.literal("")]).optional()
});

export type TripFormSchema = z.infer<typeof tripFormSchema>;
