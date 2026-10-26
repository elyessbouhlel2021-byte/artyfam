import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Package, Layers, ShoppingCart, Boxes } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const cards = [
    { icon: Package, title: "Produits", desc: "Gérer le catalogue (à venir)" },
    { icon: Layers, title: "Catégories", desc: "Gérer les catégories (à venir)" },
    { icon: Boxes, title: "Stock", desc: "Gérer l'inventaire (à venir)" },
    { icon: ShoppingCart, title: "Commandes", desc: "Suivre les commandes (à venir)" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b bg-card px-6 py-4">
        <h1 className="text-xl font-display">ARTYFAM Admin</h1>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-surface"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </header>
      <main className="container-page py-10">
        <h2 className="text-2xl font-display">Tableau de bord</h2>
        <p className="mt-2 text-sm text-muted-foreground">Bienvenue. Les sections de gestion arrivent bientôt.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-lg border bg-card p-6">
              <c.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
