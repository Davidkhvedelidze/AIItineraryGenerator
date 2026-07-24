import { nanoid } from "nanoid";
import { getPrimaryRegionImage, getPrimaryRegionLabel, type RegionImage } from "@/lib/itinerary/regionImages";
import { deriveSeasonLabel } from "@/lib/itinerary/season";
import type { ItineraryResult, TripFormData } from "@/types/trip";

type ItineraryRequestStatus = "pending" | "success" | "error";

export type SharingStatus = "private" | "pending" | "approved" | "rejected";

type SupabaseItineraryRequestRow = {
  id: string;
  short_id: string | null;
};

type StoredItineraryRequestRow = {
  short_id: string | null;
  status: ItineraryRequestStatus;
  itinerary_result: ItineraryResult | null;
  form_data: TripFormData;
  created_at: string;
  sharing_status: SharingStatus;
  share_title: string | null;
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
  short_id: string;
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
): Promise<{ id: string; shortId: string } | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const shortId = nanoid(10);

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
    language: "English",
    form_data: formData,
    itinerary_result: null,
    status: "pending",
    error_message: null,
    short_id: shortId,
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
  const row = rows[0];
  if (!row) return null;

  return { id: row.id, shortId: row.short_id ?? shortId };
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
export async function tryCreatePendingRequest(
  formData: TripFormData,
): Promise<{ id: string; shortId: string } | null> {
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

/**
 * Reads a successfully generated itinerary by its shareable short_id.
 * Server-only (Server Components / route handlers) — uses the service-role key.
 */
export async function getItineraryRequestByShortId(
  shortId: string,
): Promise<StoredItineraryRequestRow | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const url = `${config.restUrl}?short_id=eq.${encodeURIComponent(shortId)}&select=short_id,status,itinerary_result,form_data,created_at,sharing_status,share_title&limit=1`;

  const response = await fetch(url, {
    headers: getSupabaseHeaders(config.serviceRoleKey),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Unable to fetch itinerary by short_id.", await parseSupabaseError(response));
    return null;
  }

  const rows = (await response.json()) as StoredItineraryRequestRow[];
  return rows[0] ?? null;
}

type GallerySelectRow = {
  short_id: string;
  share_title: string | null;
  submitted_at: string | null;
  itinerary_result: ItineraryResult | null;
  form_data: TripFormData;
};

const GALLERY_SELECT = "short_id,share_title,submitted_at,itinerary_result,form_data";

export type SubmitToGalleryResult =
  | { ok: true }
  | { ok: false; reason: "not_eligible" };

/**
 * The only allowed sharing_status transition a client can trigger: private (or
 * previously rejected, for resubmission) -> pending. Approve/reject are admin-only
 * (see updateGallerySharingStatus). The filter below is enforced server-side by
 * Postgres, not by trusting the caller — if the row isn't eligible, zero rows are
 * updated and this returns `not_eligible` instead of silently no-op'ing.
 */
export async function submitItineraryToGallery(
  shortId: string,
  shareTitle: string,
): Promise<SubmitToGalleryResult> {
  const config = getSupabaseConfig();

  if (!config) {
    return { ok: false, reason: "not_eligible" };
  }

  const url = `${config.restUrl}?short_id=eq.${encodeURIComponent(shortId)}&status=eq.success&sharing_status=in.(private,rejected)`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...getSupabaseHeaders(config.serviceRoleKey),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      sharing_status: "pending",
      share_title: shareTitle,
      submitted_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const message = await parseSupabaseError(response);
    throw new Error(`Unable to submit itinerary to gallery: ${message}`);
  }

  const rows = (await response.json()) as unknown[];
  return rows.length > 0 ? { ok: true } : { ok: false, reason: "not_eligible" };
}

export type PendingGallerySubmission = {
  shortId: string;
  shareTitle: string | null;
  submittedAt: string | null;
  tripTitle: string;
  tripLength: number;
};

/** Admin-only listing (full form_data/itinerary_result never leave this function). */
export async function listPendingGallerySubmissions(): Promise<PendingGallerySubmission[]> {
  const config = getSupabaseConfig();

  if (!config) {
    return [];
  }

  const url = `${config.restUrl}?sharing_status=eq.pending&select=${GALLERY_SELECT}&order=submitted_at.asc&limit=100`;

  const response = await fetch(url, {
    headers: getSupabaseHeaders(config.serviceRoleKey),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Unable to list pending gallery submissions.", await parseSupabaseError(response));
    return [];
  }

  const rows = (await response.json()) as GallerySelectRow[];

  return rows.map((row) => ({
    shortId: row.short_id,
    shareTitle: row.share_title,
    submittedAt: row.submitted_at,
    tripTitle: row.itinerary_result?.tripTitle || "Untitled itinerary",
    tripLength: row.form_data.days,
  }));
}

/** Admin-only transition: pending -> approved | rejected. Never touches private/already-decided rows. */
export async function updateGallerySharingStatus(
  shortId: string,
  status: "approved" | "rejected",
): Promise<boolean> {
  const config = getSupabaseConfig();

  if (!config) {
    return false;
  }

  const url = `${config.restUrl}?short_id=eq.${encodeURIComponent(shortId)}&sharing_status=eq.pending`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...getSupabaseHeaders(config.serviceRoleKey),
      Prefer: "return=representation",
    },
    body: JSON.stringify({ sharing_status: status }),
  });

  if (!response.ok) {
    const message = await parseSupabaseError(response);
    throw new Error(`Unable to update gallery sharing status: ${message}`);
  }

  const rows = (await response.json()) as unknown[];
  return rows.length > 0;
}

export type GalleryListItem = {
  shortId: string;
  shareTitle: string;
  tripLength: number;
  travelStyle: TripFormData["travelStyle"];
  budget: TripFormData["budget"];
  regionLabel: string;
  regionImage: RegionImage;
  submittedAt: string | null;
};

/**
 * PII HARD RULE: this is the only place that reads `form_data`/`itinerary_result`
 * for the public catalog, and it must only ever return the fields listed in
 * GalleryListItem below. Never spread the raw row or `form_data` into the return
 * value — email, mobile_number, and tourDescription must never reach this type.
 */
function toGalleryListItem(row: GallerySelectRow): GalleryListItem | null {
  if (!row.itinerary_result) return null;

  return {
    shortId: row.short_id,
    shareTitle: row.share_title || row.itinerary_result.tripTitle || "A Georgia itinerary",
    tripLength: row.form_data.days,
    travelStyle: row.form_data.travelStyle,
    budget: row.form_data.budget,
    regionLabel: getPrimaryRegionLabel(row.itinerary_result.days),
    regionImage: getPrimaryRegionImage(row.itinerary_result.days),
    submittedAt: row.submitted_at,
  };
}

/** Public catalog query — approved itineraries only, newest first, capped. */
export async function listApprovedGalleryItineraries(limit = 50): Promise<GalleryListItem[]> {
  const config = getSupabaseConfig();

  if (!config) {
    return [];
  }

  const url = `${config.restUrl}?sharing_status=eq.approved&select=${GALLERY_SELECT}&order=submitted_at.desc&limit=${limit}`;

  const response = await fetch(url, {
    headers: getSupabaseHeaders(config.serviceRoleKey),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    console.error("Unable to list approved gallery itineraries.", await parseSupabaseError(response));
    return [];
  }

  const rows = (await response.json()) as GallerySelectRow[];

  return rows
    .map(toGalleryListItem)
    .filter((item): item is GalleryListItem => item !== null);
}

export type GalleryItinerary = {
  shortId: string;
  shareTitle: string;
  result: ItineraryResult;
  tripLength: number;
  travelStyle: TripFormData["travelStyle"];
  budget: TripFormData["budget"];
  interests: TripFormData["interests"];
  seasonLabel: string | null;
  submittedAt: string | null;
};

/**
 * PII HARD RULE: same allowlist as toGalleryListItem, plus the full ItineraryResult
 * (AI-generated trip content only — verified to contain no PII fields) and interests.
 * `email`, `mobileNumber`, `tourDescription`, and exact `travelDates` must never be
 * copied onto this type — season/month only, via deriveSeasonLabel.
 */
function toGalleryItinerary(row: GallerySelectRow): GalleryItinerary | null {
  if (!row.itinerary_result) return null;

  return {
    shortId: row.short_id,
    shareTitle: row.share_title || row.itinerary_result.tripTitle || "A Georgia itinerary",
    result: row.itinerary_result,
    tripLength: row.form_data.days,
    travelStyle: row.form_data.travelStyle,
    budget: row.form_data.budget,
    interests: row.form_data.interests,
    seasonLabel: deriveSeasonLabel(row.form_data.travelDates?.[0]),
    submittedAt: row.submitted_at,
  };
}

/** Public detail query — returns null for any status other than approved (pending/rejected/private all 404). */
export async function getApprovedGalleryItinerary(shortId: string): Promise<GalleryItinerary | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const url = `${config.restUrl}?short_id=eq.${encodeURIComponent(shortId)}&sharing_status=eq.approved&select=${GALLERY_SELECT}&limit=1`;

  const response = await fetch(url, {
    headers: getSupabaseHeaders(config.serviceRoleKey),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    console.error("Unable to fetch approved gallery itinerary.", await parseSupabaseError(response));
    return null;
  }

  const rows = (await response.json()) as GallerySelectRow[];
  const row = rows[0];
  return row ? toGalleryItinerary(row) : null;
}
