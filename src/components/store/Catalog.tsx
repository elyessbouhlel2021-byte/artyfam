import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { ALL_COLORS, ALL_SIZES, categories } from "@/data/catalog";
import { queryCatalog, type CatalogQuery } from "@/lib/shop";
import { ProductGrid } from "./ProductCard";
import { cn } from "@/lib/utils";

const field = "h-9 w-full rounded-md border border-input bg-card px-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  const { t } = useStore();
  if (pages <= 1) return null;
  const btn = "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition hover:bg-accent disabled:pointer-events-none disabled:opacity-40";
  return (
    <nav aria-label={t.common.page} className="mt-12 flex items-center justify-center gap-1.5">
      <button className={btn} disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label={t.common.previous}>
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onPage(p)} aria-current={p === page ? "page" : undefined}
          aria-label={`${t.common.page} ${p}`}
          className={cn(btn, p === page && "border-primary bg-primary text-primary-foreground hover:bg-primary")}>{p}</button>
      ))}
      <button className={btn} disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label={t.common.next}>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </nav>
  );
}

function Filters({ query, set, lockCategory, onReset }: { query: CatalogQuery; set: (p: Partial<CatalogQuery>) => void; lockCategory?: boolean | undefined; onReset: () => void }) {
  const { t, lang } = useStore();
  return (
    <div className="space-y-6">
      {!lockCategory && (
        <div>
          <label htmlFor="f-cat" className="eyebrow mb-2 block">{t.filters.category}</label>
          <select id="f-cat" className={field} value={query.cat ?? ""} onChange={(e) => set({ cat: e.target.value || undefined })}>
            <option value="">{t.filters.allCategories}</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name[lang]}</option>)}
          </select>
        </div>
      )}
      <fieldset>
        <legend className="eyebrow mb-2">{t.filters.price}</legend>
        <div className="flex gap-2">
          <input type="number" min={0} inputMode="numeric" aria-label={t.filters.min} placeholder={t.filters.min} className={field}
            value={query.min ?? ""} onChange={(e) => set({ min: e.target.value === "" ? undefined : Number(e.target.value) })} />
          <input type="number" min={0} inputMode="numeric" aria-label={t.filters.max} placeholder={t.filters.max} className={field}
            value={query.max ?? ""} onChange={(e) => set({ max: e.target.value === "" ? undefined : Number(e.target.value) })} />
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-2">{t.filters.size}</legend>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((s) => (
            <button key={s} type="button" aria-pressed={query.size === s} onClick={() => set({ size: query.size === s ? undefined : s })}
              className={cn("h-8 rounded-md border px-2.5 text-xs", query.size === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent")}>{s}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-2">{t.filters.color}</legend>
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((c) => (
            <button key={c.key} type="button" aria-pressed={query.color === c.key} aria-label={c.name[lang]} title={c.name[lang]}
              onClick={() => set({ color: query.color === c.key ? undefined : c.key })}
              className={cn("h-7 w-7 rounded-full border-2 ring-offset-2 ring-offset-background", query.color === c.key ? "ring-2 ring-ring" : "")}
              style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-[var(--promo)]" checked={!!query.promo} onChange={(e) => set({ promo: e.target.checked || undefined })} />
        {t.filters.promoOnly}
      </label>
      <button type="button" onClick={onReset} className="text-sm font-medium underline underline-offset-4">{t.filters.reset}</button>
    </div>
  );
}

/** Reusable catalog: filters + sorting + paginated grid, driven by URL search params. */
export function Catalog({ query, lockCategory, hideSearch }: { query: CatalogQuery; lockCategory?: boolean; hideSearch?: boolean }) {
  const { t, market } = useStore();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const result = queryCatalog(query, market);

  const set = (patch: Partial<CatalogQuery>, keepPage = false) =>
    navigate({ to: ".", search: (prev: Record<string, unknown>) => ({ ...prev, ...patch, page: keepPage ? patch.page : undefined }), replace: true, resetScroll: false });
  const reset = () => navigate({ to: ".", search: () => (lockCategory || hideSearch ? { q: hideSearch ? query.q : undefined } : {}), replace: true });

  return (
    <div className="container-page py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside aria-label={t.filters.title} className={cn("lg:block", showFilters ? "block rounded-lg border bg-card p-4 lg:border-0 lg:bg-transparent lg:p-0" : "hidden")}>
          <h2 className="mb-5 hidden font-sans text-sm font-semibold lg:block">{t.filters.title}</h2>
          <Filters query={query} set={set} lockCategory={lockCategory} onReset={reset} />
        </aside>
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">{result.total} {t.common.products}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}
                className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />{t.filters.title}
              </button>
              <label htmlFor="sort" className="sr-only">{t.filters.sort}</label>
              <select id="sort" className={cn(field, "w-auto")} value={query.sort ?? "newest"} onChange={(e) => set({ sort: e.target.value as CatalogQuery["sort"] })}>
                <option value="newest">{t.filters.newest}</option>
                <option value="price_asc">{t.filters.priceAsc}</option>
                <option value="price_desc">{t.filters.priceDesc}</option>
              </select>
            </div>
          </div>
          {result.items.length === 0 ? (
            <div className="rounded-lg border border-dashed px-6 py-16 text-center">
              <p className="font-display text-2xl">{t.filters.noResults}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t.filters.noResultsText}</p>
              <button onClick={reset} className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">{t.filters.reset}</button>
            </div>
          ) : (
            <ProductGrid items={result.items} />
          )}
          <Pagination page={result.page} pages={result.pages} onPage={(p) => { set({ page: p }, true); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </div>
      </div>
    </div>
  );
}
