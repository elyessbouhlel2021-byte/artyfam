import { createFileRoute, useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { listAdminCategories } from "@/integrations/supabase/admin-categories";
import { getAdminProduct, updateAdminProduct } from "@/integrations/supabase/admin-products";

export const Route = createFileRoute("/admin/products/$productId")({
  loader: async ({ params }) => {
    const [categories, product] = await Promise.all([
      listAdminCategories(),
      getAdminProduct({ data: params.productId }),
    ]);
    return { categories, product };
  },
  component: EditProductPage,
});

function EditProductPage() {
  const { categories, product } = Route.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();

  const [nameFr, setNameFr] = useState(product.nameFr);
  const [nameIt, setNameIt] = useState(product.nameIt);
  const [nameAr, setNameAr] = useState(product.nameAr);
  const [descriptionFr, setDescriptionFr] = useState(product.descriptionFr);
  const [descriptionIt, setDescriptionIt] = useState(product.descriptionIt);
  const [descriptionAr, setDescriptionAr] = useState(product.descriptionAr);
  const [price, setPrice] = useState(String(product.price));
  const [originalPrice, setOriginalPrice] = useState(
    product.originalPrice !== null ? String(product.originalPrice) : ""
  );
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [status, setStatus] = useState<"draft" | "published" | "hidden">(product.status);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updateAdminProduct({
        data: {
          id: product.id,
          nameFr,
          nameIt,
          nameAr,
          descriptionFr,
          descriptionIt,
          descriptionAr,
          price: parseFloat(price),
          originalPrice: originalPrice.trim() ? parseFloat(originalPrice) : null,
          categoryId,
          status,
        },
      });
      await router.invalidate();
      navigate({ to: "/admin/products" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "h-10 w-full rounded-md border border-input bg-card px-3 text-sm";
  const labelClass = "mb-1.5 block text-sm font-medium";

  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b bg-card px-6 py-4">
        <h1 className="text-xl font-display">Modifier le produit</h1>
        <Link to="/admin/products" className="text-sm text-muted-foreground underline underline-offset-4">
          Retour à la liste
        </Link>
      </header>
      <main className="container-page max-w-2xl py-8">
        <form onSubmit={submit} className="space-y-6">
          {error && (
            <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-semibold">Nom</legend>
            <div>
              <label className={labelClass}>Français *</label>
              <input className={inputClass} value={nameFr} onChange={(e) => setNameFr(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Italien</label>
              <input className={inputClass} value={nameIt} onChange={(e) => setNameIt(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Arabe</label>
              <input className={inputClass} dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-semibold">Description</legend>
            <div>
              <label className={labelClass}>Français</label>
              <textarea className={inputClass + " h-24"} value={descriptionFr} onChange={(e) => setDescriptionFr(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Italien</label>
              <textarea className={inputClass + " h-24"} value={descriptionIt} onChange={(e) => setDescriptionIt(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Arabe</label>
              <textarea className={inputClass + " h-24"} dir="rtl" value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} />
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Prix *</label>
              <input type="number" step="0.01" min="0" className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Prix barré (optionnel)</label>
              <input type="number" step="0.01" min="0" className={inputClass} value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
            </div>
          </fieldset>

          <div>
            <label className={labelClass}>Catégorie *</label>
            <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameFr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Statut</label>
            <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="hidden">Masqué</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {submitting ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </main>
    </div>
  );
}
