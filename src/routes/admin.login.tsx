import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [devDetail, setDevDetail] = useState<string | null>(null);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setStatus("loading");
    setDevDetail(null);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[admin-login/dev] Supabase URL in use:", supabase.supabaseUrl);
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      if (import.meta.env.DEV) {
        const code = (error as { code?: string }).code;
        const kind =
          error.message?.toLowerCase().includes("invalid login") ? "invalid_credentials"
          : error.status === 429 ? "rate_limited"
          : error.status != null && error.status >= 500 ? "server_error"
          : error.message?.toLowerCase().includes("fetch") ? "network_or_config"
          : "other";
        setDevDetail(`[dev only] kind=${kind} status=${error.status ?? "n/a"} code=${code ?? "n/a"} message="${error.message}"`);
      }
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-soft">
        <h1 className="text-center text-2xl font-display">ARTYFAM Admin</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Connectez-vous pour acceder au tableau de bord.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {status === "error" && (
            <div role="alert" className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Identifiants invalides ou acces refuse.
            </div>
          )}
          {import.meta.env.DEV && devDetail && (
            <div className="rounded-md border border-dashed border-muted-foreground/40 p-2 font-mono text-xs text-muted-foreground">
              {devDetail}
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              id="email" type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Mot de passe</label>
            <input
              id="password" type="password" required autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button
            type="submit" disabled={status === "loading"}
            className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "loading" ? "Connexion..." : "Se connecter"}
          </button>
          <p className="text-center text-sm">
            <Link to="/admin/forgot-password" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
              Mot de passe oublie ?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}