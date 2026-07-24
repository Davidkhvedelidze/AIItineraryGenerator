import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/admin/adminAuth";
import { updateGallerySharingStatus } from "@/lib/supabase/itineraryRequests";

const actionSchema = z.object({
  action: z.enum(["approve", "reject"]),
});

export async function POST(
  request: Request,
  { params }: { params: { shortId: string } },
) {
  if (!isAdminAuthorized()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const shortId = params.shortId?.trim();
  if (!shortId) {
    return NextResponse.json({ error: "Missing itinerary id." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { action } = actionSchema.parse(body);
    const status = action === "approve" ? "approved" : "rejected";

    const updated = await updateGallerySharingStatus(shortId, status);

    if (!updated) {
      return NextResponse.json(
        { error: "This submission is no longer pending review." },
        { status: 409 },
      );
    }

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Invalid request." },
        { status: 400 },
      );
    }

    console.error("Failed to update gallery sharing status:", error);
    return NextResponse.json(
      { error: "Unable to update sharing status." },
      { status: 500 },
    );
  }
}
