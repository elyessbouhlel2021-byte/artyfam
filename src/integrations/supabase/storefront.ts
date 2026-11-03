// Public storefront data from Supabase (real tables), mapped into the
// existing Product/Category shapes from src/data/catalog.ts so ProductCard,
// Catalog, etc. keep working unchanged. Uses the public anon client — safe,
// since RLS now restricts products to status='published' and categories
// are openly readable (confirmed via pg_policies, 2026-11-01).
//
// Known temporary simplifications, pending future work:
//   - Routing uses the real row `id` as `slug` (no slug column on live
//     products/categories tables — confirmed via information_schema).
//   - price.TND and price.EUR currently hold the SAME number (products
//     has one flat `price` column, no per-market pricing yet). Pending
//     the product_markets migration proposed in the Phase 0 audit.
//   - colors/sizes are always empty (product_variants has 0 rows today).
//   - availability is always "in_stock" (no per-variant stock to derive
//     it from yet).
//   - featured is always false (no `featured` column on live schema).
import { supabase } from "./client";
import type { Category, Product, L10n } from "@/data/catalog";

interface RawCategory {
  id: string;
  name_fr: string | null;
  name_it: string | null;
  name_ar: string | null;
  emoji: string | null;
  sort_order: number | null;
}

interface RawProduct {
  id: string;
  name_fr: string | null;
  name_it: string | null;
  name_ar: string | null;
  description_fr: string | null;
  description_it: string | null;
  description_ar: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  status: string;
  created_at: string;
}

function l10n(fr: string | null, it: string | null, ar: string | null): L10n {
  const fallback = fr ?? it ?? ar ?? "";
  return { fr: fr ?? fallback, it: it ?? fallback, ar: ar ?? fallback };
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories" as never)
    .select("id, name_fr, name_it, name_ar, emoji, sort_order")
    .order("sort_order")
    .returns<RawCategory[]>();

  if (error) throw new Error(`Échec du chargement des catégories : ${error.message}`);

  return (data ?? []).map((c) => ({
    slug: c.id,
    name: l10n(c.name_fr, c.name_it, c.name_ar),
    image: null,
  }));
}

export async function fetchPublishedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products" as never)
    .select(
      "id, name_fr, name_it, name_ar, description_fr, description_it, description_ar, price, original_price, category_id, status, created_at"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<RawProduct[]>();

  if (error) throw new Error(`Échec du chargement des produits : ${error.message}`);

  return (data ?? []).map((p) => {
    const hasDiscount = p.original_price !== null && p.original_price > p.price;
    const regular = hasDiscount ? (p.original_price as number) : p.price;
    const sale = hasDiscount ? p.price : null;

    return {
      slug: p.id,
      name: l10n(p.name_fr, p.name_it, p.name_ar),
      description: l10n(p.description_fr, p.description_it, p.description_ar),
      category: p.category_id ?? "",
      price: { TND: regular, EUR: regular },
      salePrice: sale !== null ? { TND: sale, EUR: sale } : undefined,
      promoLabel: hasDiscount ? { fr: "Promo", it: "Promo", ar: "تخفيض" } : undefined,
      colors: [],
      sizes: [],
      availability: "in_stock",
      createdAt: p.created_at,
      featured: false,
    };
  });
}
export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products" as never)
    .select(
      "id, name_fr, name_it, name_ar, description_fr, description_it, description_ar, price, original_price, category_id, status, created_at"
    )
    .eq("id", id)
    .returns<RawProduct[]>()
    .maybeSingle();

  if (error) throw new Error(`Échec du chargement du produit : ${error.message}`);
  if (!data) return null;

  const hasDiscount = data.original_price !== null && data.original_price > data.price;
  const regular = hasDiscount ? (data.original_price as number) : data.price;
  const sale = hasDiscount ? data.price : null;

  return {
    slug: data.id,
    name: l10n(data.name_fr, data.name_it, data.name_ar),
    description: l10n(data.description_fr, data.description_it, data.description_ar),
    category: data.category_id ?? "",
    price: { TND: regular, EUR: regular },
    salePrice: sale !== null ? { TND: sale, EUR: sale } : undefined,
    promoLabel: hasDiscount ? { fr: "Promo", it: "Promo", ar: "تخفيض" } : undefined,
    colors: [],
    sizes: [],
    availability: "in_stock",
    createdAt: data.created_at,
    featured: false,
  };
}