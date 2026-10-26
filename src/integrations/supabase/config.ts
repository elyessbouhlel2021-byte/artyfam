/**
 * Whether the public (browser-safe) Supabase configuration was injected at
 * build time.
 *
 * Only the publishable key is ever exposed to the browser; the service-role
 * key stays in the server runtime. The storefront works without Supabase —
 * it renders the mock catalog — but the admin sign-in needs it, so the admin
 * routes can degrade gracefully instead of crashing when it is missing.
 */
export const isSupabaseConfigured = Boolean(
  import.meta.env["VITE_SUPABASE_URL"] && import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
);
