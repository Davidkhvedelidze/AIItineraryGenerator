create extension if not exists "pgcrypto";

create table if not exists public.itinerary_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  mobile_number text,
  travelers integer not null,
  travel_dates jsonb not null,
  arrival_airport text not null,
  departure_airport text not null,
  tour_type text not null,
  budget text not null,
  travel_style text not null,
  language text not null,
  form_data jsonb not null,
  itinerary_result jsonb,
  status text not null default 'pending' check (status in ('pending', 'success', 'error')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists itinerary_requests_created_at_idx
  on public.itinerary_requests (created_at desc);

create index if not exists itinerary_requests_status_idx
  on public.itinerary_requests (status);

create index if not exists itinerary_requests_email_idx
  on public.itinerary_requests (email);

alter table public.itinerary_requests enable row level security;
