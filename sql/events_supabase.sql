-- Supabase / Postgres schema
create table if not exists events(
  id bigserial primary key,
  event text check (event in ('click','lead','sale')),
  country text,
  state text,
  zip text,
  offer_type text,
  city text,
  ts bigint not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  cid text
);
create index if not exists idx_events_ts on events(ts);
create index if not exists idx_events_geo on events(country, state, zip);
create index if not exists idx_events_offer on events(offer_type);
create index if not exists idx_events_event on events(event);