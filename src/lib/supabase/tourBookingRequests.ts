export type CreateTourBookingRequestPayload = {
  tourSlug: string;
  tourTitle: string;
  name: string;
  email?: string | null;
  whatsapp?: string | null;
  travelDate?: string | null;
  travelers?: number | null;
  pickupLocation?: string | null;
  message?: string | null;
};

type SupabaseTourBookingRequestRow = {
  id: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    restUrl: `${url.replace(/\/$/, "")}/rest/v1/tour_booking_requests`,
    serviceRoleKey,
  };
}

function getSupabaseHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

async function parseSupabaseError(response: Response): Promise<string> {
  try {
    const errorBody = (await response.json()) as { message?: string };
    return errorBody.message || response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function createTourBookingRequest(
  payload: CreateTourBookingRequestPayload,
): Promise<string | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(config.restUrl, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(config.serviceRoleKey),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      tour_slug: payload.tourSlug,
      tour_title: payload.tourTitle,
      name: payload.name,
      email: payload.email || null,
      whatsapp: payload.whatsapp || null,
      travel_date: payload.travelDate || null,
      travelers: payload.travelers || null,
      pickup_location: payload.pickupLocation || null,
      message: payload.message || null,
      source: "tour_detail_page",
      status: "new",
    }),
  });

  if (!response.ok) {
    const message = await parseSupabaseError(response);
    throw new Error(`Unable to save tour booking request: ${message}`);
  }

  const rows = (await response.json()) as SupabaseTourBookingRequestRow[];
  return rows[0]?.id ?? null;
}
