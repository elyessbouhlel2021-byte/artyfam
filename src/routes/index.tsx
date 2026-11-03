import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { parseCatalogSearch, queryCatalog } from "@/lib/shop";
import { seo } from "@/lib/seo";
import { fetchCategories, fetchPublishedProducts } from "@/integrations/supabase/storefront";
import { ImagePlaceholder, Logo, Section } from "@/components/store/bits";
import { ProductGrid } from "@/components/store/ProductCard";
import { Pagination } from "@/components/store/Catalog";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { page?: number | undefined } => ({ page: parseCatalogSearch(s).page }),
  loader: async () => {
    const [categories, products] = await Promise.all([fetchCategories(), fetchPublishedProducts()]);
    return { categories, products };
  },
  head: () => seo("Accueil", "ARTYFAM — produits livrés en Tunisie et en Italie."),
  component: Home,
});

function Home() {
  const { t, lang, market } = useStore();
  const { categories, products } = Route.useLoaderData();
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const all = queryCatalog({ page }, market, products);

  return (
    <>
      <section className="border-b bg-surface">
        <div className="container-page flex flex-col items-center py-16 text-center md:py-24">
          <p className="eyebrow mb-6">{t.home.heroEyebrow}</p>
          <Logo size="lg" />
          <h1 className="mt-8 max-w-2xl text-4xl md:text-6xl">{t.home.heroTitle}</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">{t.home.heroText}</p>
          <Link to="/shop" className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            {t.common.shopNow} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {categories.length > 0 && (
        <Section title={t.home.categories} eyebrow="ARTYFAM">
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group block">
                <div className="aspect-square overflow-hidden rounded-lg border transition group-hover:border-gold">
                  <ImagePlaceholder src={c.image} alt={c.name[lang]} />
                </div>
                <p className="mt-3 text-center text-sm font-medium">{c.name[lang]}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {newest.length > 0 && (
        <Section title={t.home.newArrivals} eyebrow={t.common.new}
          action={<Link to="/shop" className="text-sm font-medium underline underline-offset-4">{t.common.viewAll}</Link>}>
          <ProductGrid items={newest} />
        </Section>
      )}

      <Section title={t.home.all} eyebrow={`${all.total} ${t.common.products}`}>
        {all.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun produit publié pour le moment.</p>
        ) : (
          <>
            <ProductGrid items={all.items} />
            <Pagination page={all.page} pages={all.pages} onPage={(p) => navigate({ search: { page: p }, resetScroll: false })} />
          </>
        )}
      </Section>
    </>
  );
}