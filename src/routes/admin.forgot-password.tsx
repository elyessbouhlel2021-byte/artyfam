import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setStatus("loading");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    // Never reveal whether the email exists: same message either way.
    setStatus(error ? "error" : "sent");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-soft">
        <h1 className="text-center text-2xl font-display">Mot de passe oublié</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Entrez votre email, nous vous enverrons un lien de réinitialisation.
        </p>

        {status === "sent" ? (
          <div role="status" className="mt-6 flex items-start gap-2 rounded-md border border-primary/40 bg-primary/5 p-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.</span>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            {status === "error" && (
              <div role="alert" className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Une erreur est survenue. Réessayez plus tard.
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
            <button
              type="submit" disabled={status === "loading"}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "loading" ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/admin/login" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}