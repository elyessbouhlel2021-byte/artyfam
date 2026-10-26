import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error" | "invalid">("idle");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hash.get("error")) {
      setStatus("invalid");
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    const timeout = setTimeout(() => {
      setReady((r) => {
        if (!r) setStatus("invalid");
        return r;
      });
    }, 5000);

    return () => { sub.subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (password.length < 8) { setStatus("error"); return; }
    if (password !== confirm) { setStatus("error"); return; }
    setStatus("loading");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setStatus("error"); return; }
    setStatus("done");
    setTimeout(() => navigate({ to: "/admin/login" }), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-soft">
        <h1 className="text-center text-2xl font-display">Nouveau mot de passe</h1>

        {status === "invalid" ? (
          <div className="mt-6 space-y-4">
            <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Lien invalide ou expire.</span>
            </div>
            <Link
              to="/admin/forgot-password"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-surface"
            >
              Redemander un lien
            </Link>
          </div>
        ) : status === "done" ? (
          <div role="status" className="mt-6 flex items-start gap-2 rounded-md border border-primary/40 bg-primary/5 p-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Mot de passe mis a jour. Redirection...</span>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <p className="text-center text-sm text-muted-foreground">Choisissez un nouveau mot de passe (8 caracteres minimum).</p>
            {status === "error" && (
              <div role="alert" className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Mots de passe invalides ou differents.</span>
              </div>
            )}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Nouveau mot de passe</label>
              <input
                id="password" type="password" required minLength={8} autoComplete="new-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">Confirmer le mot de passe</label>
              <input
                id="confirm" type="password" required minLength={8} autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit" disabled={status === "loading" || !ready}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              {!ready ? "Verification du lien..." : status === "loading" ? "Mise a jour..." : "Mettre a jour"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/admin/login" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Retour a la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}