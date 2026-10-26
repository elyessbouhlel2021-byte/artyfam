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
    .from("admin_access")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new AdminGuardError("Server misconfiguration", 500);
  }
  if (!data) {
    throw new AdminGuardError("Forbidden", 403);
  }

  return { userId };
}