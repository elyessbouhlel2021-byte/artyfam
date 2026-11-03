// Server-only: lists categories for admin dropdowns (e.g. product category picker).
import { createServerFn } from "@tanstack/react-start";

export interface AdminCategoryRow {
  id: string;
  nameFr: string;
}

interface RawCategoryRow {
  id: string;
  name_fr: string | null;
}

export const listAdminCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminCategoryRow[]> => {
    const { requireAdmin } = await import("./admin-guard");
    await requireAdmin();

    const { supabaseAdmin } = await import("./client.server");
    const { data, error } = await supabaseAdmin
      .from("categories" as never)
      .select("id, name_fr")
      .order("sort_order")
      .returns<RawCategoryRow[]>();

    if (error) {
      throw new Error(`Failed to load categories: ${error.message}`);
    }

    return (data ?? []).map((c) => ({ id: c.id, nameFr: c.name_fr ?? "—" }));
  }
);
