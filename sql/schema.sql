
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

create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_dim_idx on public.events (country, state, zip, offer_type);
create index if not exists events_event_idx on public.events (event);

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

create table if not exists public.subscriptions (
  id bigserial primary key,
  email text not null,
  plan text not null default 'free',
  status text not null default 'inactive',
  current_period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);
create index if not exists subs_email_idx on public.subscriptions (email);

-- Credits tables
create table if not exists public.users_quota (
  id text primary key,          -- email or anon:<id>
  email text,
  plan text not null default 'free',
  month_key text not null,      -- YYYY-MM
  credits_remaining integer not null default 0,
  last_updated timestamptz default now()
);

create table if not exists public.usage_logs (
  id text not null,             -- user identity
  action text not null,
  cost integer not null default 1,
  allowed boolean not null default true,
  month_key text not null,
  created_at timestamptz default now()
);
create index if not exists usage_logs_id_idx on public.usage_logs (id, month_key);

-- Atomic decrement via function
create or replace function public.decrement_credits(p_id text, p_cost integer)
returns void
language plpgsql
as $$
begin
  update public.users_quota
  set credits_remaining = case
    when credits_remaining < 0 then credits_remaining  -- unlimited
    else greatest(credits_remaining - p_cost, 0)
  end,
  last_updated = now()
  where id = p_id;
end;
$$;
