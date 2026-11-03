import { createFileRoute, Link, Outlet, useMatches, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { listAdminProducts, deleteAdminProduct, type AdminProductRow } from "@/integrations/supabase/admin-products";

export const Route = createFileRoute("/admin/products")({
  loader: () => listAdminProducts(),
  component: AdminProductsLayout,
  pendingComponent: () => (
    <div className="container-page py-10 text-sm text-muted-foreground">Chargement des produits…</div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-page py-10 text-sm text-destructive">
      Erreur lors du chargement des produits : {error instanceof Error ? error.message : "inconnue"}
    </div>
  ),
});

const STATUS_OPTIONS = ["all", "draft", "published", "hidden"] as const;

function AdminProductsLayout() {
  const matches = useMatches();
  const isExactListRoute = matches[matches.length - 1]?.routeId === "/admin/products";

  if (!isExactListRoute) {
    return <Outlet />;
  }

  return <AdminProductsListPage />;
}

function AdminProductsListPage() {
  const products = Route.useLoaderData() as AdminProductRow[];
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.nameFr.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = status === "all" || p.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, status]);

  const handleDelete = async (id: string, nameFr: string) => {
    if (!window.confirm(`Supprimer définitivement "${nameFr}" ? Cette action est irréversible.`)) {
      return;
    }
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteAdminProduct({ data: id });
      await router.invalidate();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b bg-card px-6 py-4">
        <h1 className="text-xl font-display">Produits</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          + Ajouter un produit
        </Link>
      </header>
      <main className="container-page py-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Rechercher un produit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-64 rounded-md border border-input bg-card px-3 text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])}
            className="h-10 rounded-md border border-input bg-card px-3 text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="hidden">Masqué</option>
          </select>
        </div>

        {deleteError && (
          <div role="alert" className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {deleteError}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun produit trouvé.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-card text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Créé le</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3">{p.nameFr}</td>
                    <td className="px-4 py-3">{p.categoryNameFr}</td>
                    <td className="px-4 py-3">{p.status}</td>
                    <td className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          to="/admin/products/$productId"
                          params={{ productId: p.id }}
                          className="text-sm text-primary underline underline-offset-4"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.nameFr)}
                          disabled={deletingId === p.id}
                          className="text-sm text-destructive underline underline-offset-4 disabled:opacity-50"
                        >
                          {deletingId === p.id ? "Suppression…" : "Supprimer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}