// Server-only: admin product list, create, read-one, update, delete.
// Reuses requireAdmin() for authorization and the privileged service-role
// client. Queries use real, introspected column names (information_schema,
// confirmed 2026-10-29) — NOT the generated types.ts, which is stale here.
import { createServerFn } from "@tanstack/react-start";

export interface AdminProductRow {
  id: string;
  nameFr: string;
  categoryNameFr: string;
  status: string;
  createdAt: string;
}

interface RawProductRow {
  id: string;
  name_fr: string | null;
  category_id: string | null;
  status: string;
  created_at: string;
}

interface RawCategoryRow {
  id: string;
  name_fr: string | null;
}

export const listAdminProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminProductRow[]> => {
    const { requireAdmin } = await import("./admin-guard");
    await requireAdmin();

    const { supabaseAdmin } = await import("./client.server");

    const [{ data: products, error: productsError }, { data: categories, error: categoriesError }] =
      await Promise.all([
        supabaseAdmin
          .from("products" as never)
          .select("id, name_fr, category_id, status, created_at")
          .order("created_at", { ascending: false })
          .returns<RawProductRow[]>(),
        supabaseAdmin
          .from("categories" as never)
          .select("id, name_fr")
          .returns<RawCategoryRow[]>(),
      ]);

    if (productsError) {
      throw new Error(`Failed to load products: ${productsError.message}`);
    }
    if (categoriesError) {
      throw new Error(`Failed to load categories: ${categoriesError.message}`);
    }

    const categoryNameById = new Map(
      (categories ?? []).map((c) => [c.id, c.name_fr ?? "—"])
    );

    return (products ?? []).map((p) => ({
      id: p.id,
      nameFr: p.name_fr ?? "—",
      categoryNameFr: p.category_id ? categoryNameById.get(p.category_id) ?? "—" : "—",
      status: p.status,
      createdAt: p.created_at,
    }));
  }
);

export interface ProductFormData {
  nameFr: string;
  nameIt: string;
  nameAr: string;
  descriptionFr: string;
  descriptionIt: string;
  descriptionAr: string;
  price: number;
  originalPrice: number | null;
  categoryId: string;
  status: "draft" | "published" | "hidden";
}

function validateProductInput(input: ProductFormData): ProductFormData {
  if (!input.nameFr.trim()) throw new Error("Le nom en français est requis.");
  if (!input.categoryId) throw new Error("La catégorie est requise.");
  if (!Number.isFinite(input.price) || input.price < 0) {
    throw new Error("Le prix doit être un nombre positif.");
  }
  if (
    input.originalPrice !== null &&
    (!Number.isFinite(input.originalPrice) || input.originalPrice < input.price)
  ) {
    throw new Error("Le prix barré doit être supérieur ou égal au prix.");
  }
  return input;
}

export const createAdminProduct = createServerFn({ method: "POST" })
  .inputValidator(validateProductInput)
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { requireAdmin } = await import("./admin-guard");
    await requireAdmin();

    const { supabaseAdmin } = await import("./client.server");
    const { data: inserted, error } = await supabaseAdmin
      .from("products" as never)
      .insert({
        name_fr: data.nameFr.trim(),
        name_it: data.nameIt.trim() || null,
        name_ar: data.nameAr.trim() || null,
        description_fr: data.descriptionFr.trim() || null,
        description_it: data.descriptionIt.trim() || null,
        description_ar: data.descriptionAr.trim() || null,
        price: data.price,
        original_price: data.originalPrice,
        category_id: data.categoryId,
        status: data.status,
      } as never)
      .select("id")
      .single();

    if (error) {
      throw new Error(`Échec de la création du produit : ${error.message}`);
    }

    return { id: (inserted as { id: string }).id };
  });

interface RawProductFull {
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
}

export const getAdminProduct = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<ProductFormData & { id: string }> => {
    const { requireAdmin } = await import("./admin-guard");
    await requireAdmin();

    const { supabaseAdmin } = await import("./client.server");
    const { data: row, error } = await supabaseAdmin
      .from("products" as never)
      .select(
        "id, name_fr, name_it, name_ar, description_fr, description_it, description_ar, price, original_price, category_id, status"
      )
      .eq("id", id)
      .returns<RawProductFull[]>()
      .single();

    if (error || !row) {
      throw new Error(`Produit introuvable : ${error?.message ?? "inconnu"}`);
    }

    return {
      id: row.id,
      nameFr: row.name_fr ?? "",
      nameIt: row.name_it ?? "",
      nameAr: row.name_ar ?? "",
      descriptionFr: row.description_fr ?? "",
      descriptionIt: row.description_it ?? "",
      descriptionAr: row.description_ar ?? "",
      price: row.price,
      originalPrice: row.original_price,
      categoryId: row.category_id ?? "",
      status: row.status as ProductFormData["status"],
    };
  });

export const updateAdminProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string } & ProductFormData) => {
    validateProductInput(input);
    return input;
  })
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { requireAdmin } = await import("./admin-guard");
    await requireAdmin();

    const { supabaseAdmin } = await import("./client.server");
    const { error } = await supabaseAdmin
      .from("products" as never)
      .update({
        name_fr: data.nameFr.trim(),
        name_it: data.nameIt.trim() || null,
        name_ar: data.nameAr.trim() || null,
        description_fr: data.descriptionFr.trim() || null,
        description_it: data.descriptionIt.trim() || null,
        description_ar: data.descriptionAr.trim() || null,
        price: data.price,
        original_price: data.originalPrice,
        category_id: data.categoryId,
        status: data.status,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.id);

    if (error) {
      throw new Error(`Échec de la mise à jour : ${error.message}`);
    }

    return { id: data.id };
  });

export const deleteAdminProduct = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<{ ok: true }> => {
    const { requireAdmin } = await import("./admin-guard");
    await requireAdmin();

    const { supabaseAdmin } = await import("./client.server");
    const { error } = await supabaseAdmin
      .from("products" as never)
      .delete()
      .eq("id", id);

    if (error) {
      // Postgres foreign-key violation (e.g. referenced by an existing order)
      if ((error as { code?: string }).code === "23503") {
        throw new Error(
          "Ce produit est référencé par une commande ou un autre enregistrement et ne peut pas être supprimé."
        );
      }
      throw new Error(`Échec de la suppression : ${error.message}`);
    }

    return { ok: true };
  });