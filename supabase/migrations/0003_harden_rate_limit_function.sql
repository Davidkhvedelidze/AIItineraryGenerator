-- Supabase advisor 0011 (function_search_path_mutable): pin search_path so the
-- function can't be hijacked by objects created in another schema.
alter function public.increment_rate_limit(text, integer, integer)
  set search_path = public, pg_temp;

-- Only the server (service role) calls this RPC. Without this, anyone holding the
-- public anon key could call it directly and fill or poison the rate_limits table.
revoke execute on function public.increment_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.increment_rate_limit(text, integer, integer)
  to service_role;

-- Already enabled in production; kept here so a fresh setup matches.
alter table public.tour_booking_requests enable row level security;
