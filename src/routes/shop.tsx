import { createFileRoute } from "@tanstack/react-router";
import { parseCatalogSearch } from "@/lib/shop";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/store/bits";
import { Catalog } from "@/components/store/Catalog";

export const Route = createFileRoute("/shop")({
  validateSearch: parseCatalogSearch,
  head: () => seo("Boutique", "Tous les produits ARTYFAM : filtrez par catégorie, prix, taille, couleur et promotions."),
  component: Shop,
});

function Shop() {
  const { t } = useStore();
  return (
    <>
      <PageHeader title={t.nav.shop} />
      <Catalog query={Route.useSearch()} />
    </>
  );
}
