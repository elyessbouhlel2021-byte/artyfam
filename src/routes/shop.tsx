import { createFileRoute } from "@tanstack/react-router";
import { parseCatalogSearch } from "@/lib/shop";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/store/bits";
import { Catalog } from "@/components/store/Catalog";
import { fetchCategories, fetchPublishedProducts } from "@/integrations/supabase/storefront";

export const Route = createFileRoute("/shop")({
  validateSearch: parseCatalogSearch,
  loader: async () => {
    const [products, categories] = await Promise.all([fetchPublishedProducts(), fetchCategories()]);
    return { products, categories };
  },
  head: () => seo("Boutique", "Tous les produits ARTYFAM : filtrez par catégorie et prix."),
  component: Shop,
});

function Shop() {
  const { t } = useStore();
  const { products, categories } = Route.useLoaderData();
  return (
    <>
      <PageHeader title={t.nav.shop} />
      <Catalog query={Route.useSearch()} products={products} categories={categories} />
    </>
  );
}