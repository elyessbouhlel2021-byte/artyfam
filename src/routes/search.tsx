import { createFileRoute } from "@tanstack/react-router";
import { parseCatalogSearch } from "@/lib/shop";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/store/bits";
import { Catalog } from "@/components/store/Catalog";

export const Route = createFileRoute("/search")({
  validateSearch: parseCatalogSearch,
  head: () => seo("Recherche", "Recherchez parmi les produits ARTYFAM."),
  component: SearchPage,
});

function SearchPage() {
  const { t } = useStore();
  const query = Route.useSearch();
  return (
    <>
      <PageHeader title={query.q ? `${t.filters.searchFor} « ${query.q} »` : t.nav.search} />
      <Catalog query={query} hideSearch />
    </>
  );
}
