
-- AdShield AI schema for metrics collection

create table if not exists public.events (
  id bigserial primary key,
  created_at timestamp with time zone default now(),
  event text not null check (event in ('post','click','lead','sale')),
  payload jsonb not null default '{}'::jsonb,
  country text,
  state text,
  zip text,
  offer_type text,
  user_id text
);

-- Helpful indexes
create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_dim_idx on public.events (country, state, zip, offer_type);
create index if not exists events_event_idx on public.events (event);

-- Optional: a simple view the API can query directly
create or replace view public.metrics_view as
select
  coalesce(country, 'NA') as country,
  coalesce(state, 'NA') as state,
  coalesce(zip, 'NA') as zip,
  coalesce(offer_type, 'NA') as offer_type,
  sum(case when event = 'post' then 1 else 0 end) as posts,
  sum(case when event = 'click' then 1 else 0 end) as clicks,
  sum(case when event = 'lead' then 1 else 0 end) as leads,
  sum(case when event = 'sale' then 1 else 0 end) as sales
from public.events
group by 1,2,3,4
order by 1,2,3,4;
