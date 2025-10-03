-- Audit logs table
create table if not exists audit_logs(
  id bigserial primary key,
  ts bigint not null,
  ip text,
  action text,
  meta jsonb
);
create index if not exists idx_audit_ts on audit_logs(ts);
create index if not exists idx_audit_action on audit_logs(action);

-- App settings (simple key/value JSON)
create table if not exists app_settings(
  id bigserial primary key,
  k text unique not null,
  v jsonb not null default '{}'::jsonb
);