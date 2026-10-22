import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { banners, categories, products, promotions } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { parseCatalogSearch, queryCatalog } from "@/lib/shop";
import { seo } from "@/lib/seo";
import { ImagePlaceholder, Logo, Section } from "@/components/store/bits";
import { ProductGrid } from "@/components/store/ProductCard";
import { Pagination } from "@/components/store/Catalog";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>) => ({ page: parseCatalogSearch(s).page }),
  head: () => seo("Accueil", "ARTYFAM — vêtements, chaussures, sacs et maison, livrés en Tunisie et en Italie."),
  component: Home,
});

function Home() {
  const { t, lang, market } = useStore();
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const banner = banners[0];
  const promo = promotions.find((p) => p.active);
  const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const all = queryCatalog({ page }, market);

  return (
    <>
      {/* Brand hero with large logo */}
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

      {/* Admin-managed banner — hidden entirely when no data */}
      {banner && (
        <section className="container-page pt-10">
          <Link to={banner.ctaHref} className="relative block aspect-[21/8] overflow-hidden rounded-xl">
            <img src={banner.image} alt={banner.title[lang]} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/60 to-transparent p-8 text-background">
              <h2 className="text-4xl">{banner.title[lang]}</h2>
              <p className="mt-2">{banner.subtitle[lang]}</p>
            </div>
          </Link>
        </section>
      )}

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

      {promo && (
        <section className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-promo p-8 text-promo-foreground md:flex-row md:items-center md:p-12">
            <div>
              <p className="eyebrow mb-2 text-promo-foreground/70">{t.common.sale}</p>
              <h2 className="text-3xl md:text-4xl">{promo.title[lang]}</h2>
              <p className="mt-2 max-w-xl opacity-80">{promo.text[lang]}</p>
            </div>
            <Link to="/shop" search={{ promo: true }} className="inline-flex h-11 shrink-0 items-center rounded-md border border-current/40 px-6 text-sm font-medium transition hover:bg-promo-foreground/10">
              {t.common.viewAll}
            </Link>
          </div>
        </section>
      )}

      <Section title={t.home.newArrivals} eyebrow={t.common.new}
        action={<Link to="/shop" className="text-sm font-medium underline underline-offset-4">{t.common.viewAll}</Link>}>
        <ProductGrid items={newest} />
      </Section>

      <Section title={t.home.featured} eyebrow={t.home.popular} className="border-y bg-surface">
        <ProductGrid items={featured} />
      </Section>

      <Section title={t.home.all} eyebrow={`${all.total} ${t.common.products}`}>
        <ProductGrid items={all.items} />
        <Pagination page={all.page} pages={all.pages} onPage={(p) => navigate({ search: { page: p }, resetScroll: false })} />
      </Section>
    </>
  );
}
