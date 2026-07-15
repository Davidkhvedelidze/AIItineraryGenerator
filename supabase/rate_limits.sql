create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 0,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

-- Atomic increment-and-check: race-free even under concurrent serverless
-- invocations, since the insert/update happens as a single statement.
-- Resets the window when it has expired instead of failing the request.
create or replace function public.increment_rate_limit(
  p_key text,
  p_window_seconds integer,
  p_limit integer
)
returns table (count integer, allowed boolean, retry_after_seconds integer)
language plpgsql
as $$
declare
  v_now timestamptz := now();
  v_count integer;
  v_window_start timestamptz;
begin
  insert into public.rate_limits as rl (key, count, window_start)
  values (p_key, 1, v_now)
  on conflict (key) do update
    set count = case
          when rl.window_start + make_interval(secs => p_window_seconds) <= v_now
            then 1
          else rl.count + 1
        end,
        window_start = case
          when rl.window_start + make_interval(secs => p_window_seconds) <= v_now
            then v_now
          else rl.window_start
        end
  returning rl.count, rl.window_start into v_count, v_window_start;

  return query select
    v_count,
    v_count <= p_limit,
    greatest(0, ceil(extract(epoch from (v_window_start + make_interval(secs => p_window_seconds) - v_now))))::integer;
end;
$$;

create index if not exists rate_limits_window_start_idx
  on public.rate_limits (window_start);
