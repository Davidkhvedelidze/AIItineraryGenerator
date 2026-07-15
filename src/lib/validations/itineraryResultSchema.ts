import { z } from "zod";

export const itineraryDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  region: z.string(),
  morning: z.string(),
  afternoon: z.string(),
  evening: z.string(),
  foodSuggestion: z.string(),
  travelTip: z.string(),
});

export const itineraryResultSchema = z.object({
  tripTitle: z.string(),
  overview: z.string(),
  days: z.array(itineraryDaySchema),
  totalPrice: z.string(),
  pricePerPerson: z.string(),
  estimatedBudget: z.string(),
  includedServices: z.array(z.string()),
  notIncludedServices: z.array(z.string()),
  bestFor: z.array(z.string()),
  packingTips: z.array(z.string()),
  transportTips: z.array(z.string()),
  localFoodToTry: z.array(z.string()),
  bookingSuggestion: z.string(),
});

export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type ItineraryResult = z.infer<typeof itineraryResultSchema>;
