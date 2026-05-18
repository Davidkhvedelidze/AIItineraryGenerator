create table if not exists tour_booking_requests (
  id uuid primary key default gen_random_uuid(),
  tour_slug text not null,
  tour_title text not null,
  name text not null,
  email text,
  whatsapp text,
  travel_date date,
  travelers int,
  pickup_location text,
  message text,
  status text default 'new',
  source text default 'tour_detail_page',
  created_at timestamptz default now()
);
