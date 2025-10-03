// Audit logger stub — replace with Supabase / Postgres insert later.
export async function addAudit(action, details = {}) {
  try {
    // eslint-disable-next-line no-console
    console.log(`[audit] ${action}`, details);
  } catch {}
}