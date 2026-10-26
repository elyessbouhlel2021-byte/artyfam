import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/integrations/supabase/config";

const checkAdminAccess = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin, AdminGuardError } = await import("@/integrations/supabase/admin-guard");
  try {
    await requireAdmin();
    return { ok: true as const };
  } catch (e) {
    if (e instanceof AdminGuardError) return { ok: false as const, status: e.status };
    return { ok: false as const, status: 500 };
  }
});

// Routes under /admin that must stay reachable without an authorized admin
// session: the login form itself, and the two password-recovery steps
// (a recovery link must be able to land on /admin/reset-password before any
// normal session exists).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (PUBLIC_ADMIN_PATHS.includes(location.pathname)) return;

    // UX-only check: real enforcement happens server-side in checkAdminAccess
    // (and independently, in any privileged server function).
    if (!isSupabaseConfigured) {
      // No public Supabase configuration in this build: there can be no
      // session, so there is nothing to check. Fail closed.
      throw redirect({ to: "/admin/login" });
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/admin/login" });
    }

    let result: Awaited<ReturnType<typeof checkAdminAccess>>;
    try {
      result = await checkAdminAccess();
    } catch {
      // The server runtime is unreachable — e.g. the static GitHub Pages
      // deployment, which cannot execute server functions. The privileged
      // check cannot be performed, so the dashboard must not render.
      throw redirect({ to: "/admin/login" });
    }
    if (!result.ok) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: () => <Outlet />,
});
