alter table public.itinerary_requests
  add column if not exists sharing_status text not null default 'private'
    check (sharing_status in ('private', 'pending', 'approved', 'rejected')),
  add column if not exists share_title text,
  add column if not exists submitted_at timestamptz;

create index if not exists itinerary_requests_sharing_status_idx
  on public.itinerary_requests (sharing_status);
