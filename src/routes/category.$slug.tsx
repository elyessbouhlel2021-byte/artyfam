import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategory } from "@/data/catalog";
import { parseCatalogSearch } from "@/lib/shop";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/store/bits";
import { Catalog } from "@/components/store/Catalog";

export const Route = createFileRoute("/category/$slug")({
  validateSearch: parseCatalogSearch,
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo(loaderData.category.name.fr, `Découvrez la catégorie ${loaderData.category.name.fr} chez ARTYFAM.`)
      : { meta: [{ title: "Catégorie | ARTYFAM" }, { name: "robots", content: "noindex" }] },
  component: CategoryPage,
});

function CategoryPage() {
  const { lang } = useStore();
  const { category } = Route.useLoaderData();
  const search = Route.useSearch();
  return (
    <>
      <PageHeader title={category.name[lang]} />
      <Catalog query={{ ...search, cat: category.slug }} lockCategory />
    </>
  );
}
