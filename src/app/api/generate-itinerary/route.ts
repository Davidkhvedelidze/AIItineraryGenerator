import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { buildItineraryPrompt } from "@/lib/ai/buildItineraryPrompt";
import { parseItineraryResponse } from "@/lib/ai/parseItineraryResponse";
import { tripFormSchema } from "@/lib/validations/tripFormSchema";

const itineraryResultSchema = z.object({
  tripTitle: z.string(),
  overview: z.string(),
  days: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      region: z.string(),
      morning: z.string(),
      afternoon: z.string(),
      evening: z.string(),
      foodSuggestion: z.string(),
      travelTip: z.string()
    })
  ),
  estimatedBudget: z.string(),
  bestFor: z.array(z.string()),
  packingTips: z.array(z.string()),
  transportTips: z.array(z.string()),
  localFoodToTry: z.array(z.string()),
  bookingSuggestion: z.string()
});

function getOpenAIErrorResponse(error: unknown) {
  const apiError = error as { status?: number; code?: string; message?: string };

  if (apiError.status === 401) {
    return NextResponse.json(
      { success: false, message: "OpenAI rejected the API key. Please check or replace OPENAI_API_KEY." },
      { status: 401 }
    );
  }

  if (apiError.status === 429 || apiError.code === "insufficient_quota") {
    return NextResponse.json(
      { success: false, message: "OpenAI quota is exceeded. Please check billing, credits, or project limits for this API key." },
      { status: 429 }
    );
  }

  if (apiError.message === "Connection error.") {
    return NextResponse.json(
      { success: false, message: "Unable to connect to OpenAI right now. Please check network access and try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: false, message: "Unable to generate itinerary right now." }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "AI itinerary generation is not configured yet. Please add an OpenAI API key." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validatedForm = tripFormSchema.safeParse(body);

    if (!validatedForm.success) {
      return NextResponse.json({ success: false, message: "Invalid request data." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey });
    const prompt = buildItineraryPrompt(validatedForm.data);

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return only strict JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const aiText = completion.choices[0]?.message?.content;

    if (!aiText) {
      return NextResponse.json({ success: false, message: "No itinerary generated." }, { status: 502 });
    }

    const parsed = parseItineraryResponse(aiText);
    const validatedItinerary = itineraryResultSchema.safeParse(parsed);

    if (!validatedItinerary.success) {
      return NextResponse.json({ success: false, message: "Received invalid itinerary format." }, { status: 502 });
    }

    return NextResponse.json({ success: true, data: validatedItinerary.data }, { status: 200 });
  } catch (error) {
    return getOpenAIErrorResponse(error);
  }
}
