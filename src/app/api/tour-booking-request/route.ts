import { NextResponse } from "next/server";
import { z } from "zod";
import { createTourBookingRequest } from "@/lib/supabase/tourBookingRequests";

const tourBookingRequestSchema = z
  .object({
    tourSlug: z.string().min(1),
    tourTitle: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email().optional().nullable(),
    whatsapp: z.string().optional().nullable(),
    travelDate: z.string().optional().nullable(),
    travelers: z.number().int().min(1).optional().nullable(),
    pickupLocation: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
  })
  .refine((data) => Boolean(data.email || data.whatsapp), {
    message: "Email or WhatsApp is required.",
    path: ["whatsapp"],
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = tourBookingRequestSchema.parse(body);
    const requestId = await createTourBookingRequest(payload);

    return NextResponse.json({ ok: true, requestId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Invalid booking request." },
        { status: 400 },
      );
    }

    console.error("Failed to save tour booking request:", error);
    return NextResponse.json(
      { error: "Unable to save booking request." },
      { status: 500 },
    );
  }
}
