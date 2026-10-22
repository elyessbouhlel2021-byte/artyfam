import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct, products, getCategory } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";
import { ImagePlaceholder } from "@/components/store/bits";
import { PriceTag, ProductGrid } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo(loaderData.product.name.fr, loaderData.product.description.fr.slice(0, 150))
      : { meta: [{ title: "Produit | ARTYFAM" }, { name: "robots", content: "noindex" }] },
  component: ProductPage,
});

export function QtySelector({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const { t } = useStore();
  const b = "inline-flex h-10 w-10 items-center justify-center transition hover:bg-accent disabled:opacity-40";
  return (
    <div className="inline-flex items-center rounded-md border">
      <button type="button" className={b} aria-label={t.product.decrease} disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus className="h-4 w-4" /></button>
      <span className="w-10 text-center text-sm font-medium" aria-live="polite">{value}</span>
      <button type="button" className={b} aria-label={t.product.increase} disabled={value >= 99} onClick={() => onChange(value + 1)}><Plus className="h-4 w-4" /></button>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { t, lang, addToCart } = useStore();
  const [colorKey, setColorKey] = useState(product.colors[0].key);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const color = product.colors.find((c) => c.key === colorKey) ?? product.colors[0];
  const gallerySlots = Math.max(color.images.length, 4);
  const cat = getCategory(product.category);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const out = product.availability === "out";

  const add = () => {
    if (product.sizes.length > 0 && !size) { setSizeError(true); return; }
    addToCart({ slug: product.slug, color: color.key, size: size ?? "-", qty });
    toast.success(t.common.added, { description: `${product.name[lang]} · ${color.name[lang]}${size ? ` · ${size}` : ""}` });
  };

  return (
    <>
      <div className="container-page py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link to="/shop" className="hover:underline">{t.nav.shop}</Link>
          {cat && <> / <Link to="/category/$slug" params={{ slug: cat.slug }} className="hover:underline">{cat.name[lang]}</Link></>}
        </nav>
        <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-lg border">
              <ImagePlaceholder key={color.key + imgIdx} src={color.images[imgIdx]} alt={`${product.name[lang]} — ${color.name[lang]}`} tint={color.hex}
                label={`${color.name[lang]} · ${imgIdx + 1}/${gallerySlots}`} />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {Array.from({ length: gallerySlots }, (_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} aria-label={`${i + 1}`} aria-current={i === imgIdx}
                  className={cn("aspect-square overflow-hidden rounded-md border", i === imgIdx && "ring-2 ring-ring")}>
                  <ImagePlaceholder src={color.images[i]} alt="" tint={color.hex} label=" " />
                </button>
              ))}
            </div>
          </div>
          <div>
            {product.promoLabel && <span className="mb-3 inline-block rounded bg-promo px-2 py-0.5 text-xs font-bold text-promo-foreground">{product.promoLabel[lang]}</span>}
            <h1 className="text-4xl md:text-5xl">{product.name[lang]}</h1>
            <PriceTag product={product} className="mt-4 text-xl" />
            <p className={cn("mt-2 text-sm", out ? "text-muted-foreground" : product.availability === "low" ? "text-promo dark:text-gold" : "text-success")}>
              {out ? t.common.outOfStock : product.availability === "low" ? t.common.lowStock : t.common.inStock}
            </p>

            <fieldset className="mt-8">
              <legend className="eyebrow mb-3">{t.product.color}: <span className="normal-case tracking-normal text-foreground">{color.name[lang]}</span></legend>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button key={c.key} type="button" aria-label={c.name[lang]} aria-pressed={c.key === colorKey} title={c.name[lang]}
                    onClick={() => { setColorKey(c.key); setImgIdx(0); }}
                    className={cn("h-9 w-9 rounded-full border-2 ring-offset-2 ring-offset-background transition", c.key === colorKey && "ring-2 ring-ring")}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </fieldset>

            {product.sizes.length > 0 && (
              <fieldset className="mt-6">
                <legend className="eyebrow mb-3">{t.product.size}</legend>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button key={s} type="button" aria-pressed={size === s} onClick={() => { setSize(s); setSizeError(false); }}
                      className={cn("h-10 min-w-12 rounded-md border px-3 text-sm transition", size === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent")}>{s}</button>
                  ))}
                </div>
                {sizeError && <p role="alert" className="mt-2 text-sm text-destructive">{t.product.selectSize}</p>}
              </fieldset>
            )}

            <div className="mt-6">
              <p className="eyebrow mb-3">{t.product.quantity}</p>
              <div className="flex flex-wrap gap-3">
                <QtySelector value={qty} onChange={setQty} />
                <button onClick={add} disabled={out}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40">
                  {out ? t.common.outOfStock : t.common.addToCart}
                </button>
              </div>
            </div>

            <div className="mt-10 border-t pt-6">
              <h2 className="eyebrow mb-3">{t.product.description}</h2>
              <p className="leading-relaxed text-muted-foreground">{product.description[lang]}</p>
            </div>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="container-page border-t py-12">
          <h2 className="mb-8 text-3xl">{t.product.related}</h2>
          <ProductGrid items={related} />
        </section>
      )}
    </>
  );
}
