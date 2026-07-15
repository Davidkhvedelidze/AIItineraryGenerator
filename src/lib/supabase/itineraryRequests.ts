import type { ItineraryResult, TripFormData } from "@/types/trip";

type ItineraryRequestStatus = "pending" | "success" | "error";

type SupabaseItineraryRequestRow = {
  id: string;
};

type CreateItineraryRequestPayload = {
  email: string;
  mobile_number: string | null;
  travelers: number;
  /** [arrivalDateTime, departureDateTime] — index 0 is always the earlier date. */
  travel_dates: [string, string];
  arrival_airport: string;
  departure_airport: string;
  tour_type: string;
  budget: string;
  travel_style: string;
  language: string;
  form_data: TripFormData;
  itinerary_result: ItineraryResult | null;
  status: ItineraryRequestStatus;
  error_message: string | null;
};

type UpdateItineraryRequestPayload = {
  status: ItineraryRequestStatus;
  itinerary_result?: ItineraryResult | null;
  error_message?: string | null;
  updated_at: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    restUrl: `${url.replace(/\/$/, "")}/rest/v1/itinerary_requests`,
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

export async function createItineraryRequest(
  formData: TripFormData,
): Promise<string | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const payload: CreateItineraryRequestPayload = {
    email: formData.email,
    mobile_number: formData.mobileNumber?.trim() || null,
    travelers: formData.travelers,
    travel_dates: formData.travelDates,
    arrival_airport: formData.arrivalAirport,
    departure_airport: formData.departureAirport,
    tour_type: formData.tourType,
    budget: formData.budget,
    travel_style: formData.travelStyle,
    language: formData.language,
    form_data: formData,
    itinerary_result: null,
    status: "pending",
    error_message: null,
  };

  const response = await fetch(config.restUrl, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(config.serviceRoleKey),
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await parseSupabaseError(response);
    throw new Error(`Unable to save itinerary request: ${message}`);
  }

  const rows = (await response.json()) as SupabaseItineraryRequestRow[];
  return rows[0]?.id ?? null;
}

export async function updateItineraryRequest(
  requestId: string | null,
  fields: Omit<UpdateItineraryRequestPayload, "updated_at">,
) {
  const config = getSupabaseConfig();

  if (!config || !requestId) {
    return;
  }

  const response = await fetch(
    `${config.restUrl}?id=eq.${encodeURIComponent(requestId)}`,
    {
      method: "PATCH",
      headers: getSupabaseHeaders(config.serviceRoleKey),
      body: JSON.stringify({
        ...fields,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  if (!response.ok) {
    const message = await parseSupabaseError(response);
    throw new Error(`Unable to update itinerary request: ${message}`);
  }
}

/**
 * Best-effort request logging: a Supabase outage must never block itinerary
 * generation. Failures are logged server-side and swallowed here.
 */
export async function tryCreatePendingRequest(formData: TripFormData): Promise<string | null> {
  try {
    return await createItineraryRequest(formData);
  } catch (error) {
    console.error("Unable to create pending itinerary request; continuing without it.", error);
    return null;
  }
}

/** Best-effort update — never throws, so a successful itinerary response is never blocked by it. */
export async function tryUpdateRequest(
  requestId: string | null,
  fields: Omit<UpdateItineraryRequestPayload, "updated_at">,
): Promise<void> {
  if (!requestId) {
    return;
  }

  try {
    await updateItineraryRequest(requestId, fields);
  } catch (error) {
    console.error("Unable to update itinerary request; continuing.", error);
  }
}
