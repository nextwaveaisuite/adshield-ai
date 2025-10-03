create table if not exists public.team_members(id bigserial primary key,email text unique not null,role text not null default 'member',created_at timestamptz default now());
create table if not exists public.invites(id bigserial primary key,email text not null,role text not null default 'member',token text not null unique,created_at timestamptz default now());
