// Server-only Admin authorization guard.
// Verifies the bearer token with Supabase, then checks admin_access
// using the privileged service-role client. Never trusts client-supplied
// user IDs or isAdmin flags.
import { getRequest } from "@tanstack/react-start/server";

export class AdminGuardError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function getVerifiedUserId(): Promise<string> {
  const SUPABASE_URL = process.env["SUPABASE_URL"];
  const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"];
  console.log("[admin-guard] env check:", { hasUrl: !!SUPABASE_URL, hasKey: !!SUPABASE_PUBLISHABLE_KEY });

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    // Configuration failure must never be treated as "not admin, but ok".
    throw new AdminGuardError("Server misconfiguration", 500);
  }

  const request = getRequest();
  const authHeader = request?.headers?.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AdminGuardError("Unauthorized", 401);
  }
  const token = authHeader.replace("Bearer ", "");
  if (!token || token.split(".").length !== 3) {
    throw new AdminGuardError("Unauthorized", 401);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    console.error("[admin-guard] getClaims failed:", JSON.stringify(error));
    throw new AdminGuardError("Unauthorized", 401);
  }
  return data.claims.sub as string;
}

/**
 * Throws AdminGuardError (401/403/500) if the current request is not from
 * a verified, authorized Admin. Returns the verified admin user id on success.
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  const userId = await getVerifiedUserId();

  // Lazy import: service-role client must never be bundled into browser code.
  const { supabaseAdmin } = await import("./client.server");

  const { data, error } = await supabaseAdmin
    .from("admin_access" as never)
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle<AdminAccessRow>();

  if (error) {
    console.error("[admin-guard] admin_access query failed:", JSON.stringify(error));
    throw new AdminGuardError("Server misconfiguration", 500);
  }
  if (!data) {
    throw new AdminGuardError("Forbidden", 403);
  }

  return { userId };
}
// Local augmentation: `admin_access` isn't present in the generated
// Database type (src/integrations/supabase/types.ts). Either the codegen
// is stale against the real schema, or the table doesn't exist yet in the
// live database — confirm and regenerate real types with:
//   supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts
// This augmentation only satisfies the type-checker; it does not change
// the query's runtime behavior, and a missing/misnamed table still fails
// the query and is still treated as a 500 (fail closed) below.
interface AdminAccessRow {
  user_id: string;
}