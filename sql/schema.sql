-- RBAC tables
create table if not exists public.team_members(
  id bigserial primary key,
  email text unique not null,
  role text not null check (role in ('member','analyst','admin')) default 'member',
  created_at timestamptz default now()
);

create table if not exists public.invites(
  id bigserial primary key,
  email text not null,
  role text not null check (role in ('member','analyst','admin')) default 'member',
  token text not null unique,
  created_at timestamptz default now()
);

create index if not exists idx_invites_token on public.invites(token);

-- Quotas & usage
create table if not exists public.users_quota(
  id bigserial primary key,
  email text unique not null,
  plan text not null default 'free',
  monthly_credits int not null default 1000,
  credits_left int not null default 1000,
  resets_on date default (now() + interval '30 days')
);

create table if not exists public.usage_logs(
  id bigserial primary key,
  email text not null,
  action text not null,
  delta int default 0,
  meta jsonb,
  created_at timestamptz default now()
);

-- Events (for /api/metrics)
create table if not exists public.events(
  id bigserial primary key,
  event text not null,
  payload jsonb,
  meta jsonb,
  created_at timestamptz default now()
);
