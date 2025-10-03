-- Vercel Postgres schema
create table if not exists events(
  id bigserial primary key,
  event text,
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
-- Add constraints optionally:
-- alter table events add constraint chk_event check (event in ('click','lead','sale'));
create index if not exists idx_events_ts on events(ts);
create index if not exists idx_events_geo on events(country, state, zip);
create index if not exists idx_events_offer on events(offer_type);
create index if not exists idx_events_event on events(event);