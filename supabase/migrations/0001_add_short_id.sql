alter table public.itinerary_requests
  add column if not exists short_id text unique;

create index if not exists itinerary_requests_short_id_idx
  on public.itinerary_requests (short_id);
