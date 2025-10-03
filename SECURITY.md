# Security

- All admin routes check role on the server.
- Invites use single-use tokens stored in `invites` table.
- Avoid exposing `SUPABASE_SERVICE_ROLE` to client — all usage here is server-side only.
