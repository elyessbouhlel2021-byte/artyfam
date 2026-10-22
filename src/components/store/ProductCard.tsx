import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/shop";
import { MARKETS } from "@/data/config";
import { ImagePlaceholder } from "./bits";

export function PriceTag({ product, className }: { product: Product; className?: string }) {
  const { market, lang } = useStore();
  const cur = MARKETS[market].currency;
  return (
    <div className={className}>
      {product.salePrice ? (
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-promo dark:text-foreground">{formatPrice(product.salePrice[cur], market, lang)}</span>
          <s className="text-xs text-muted-foreground">{formatPrice(product.price[cur], market, lang)}</s>
        </span>
      ) : (
        <span className="font-semibold">{formatPrice(product.price[cur], market, lang)}</span>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useStore();
  const first = product.colors[0];
  return (
    <article className="group relative flex flex-col">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block overflow-hidden rounded-lg border bg-card">
        <div className="relative aspect-[4/5] transition duration-500 group-hover:scale-[1.02]">
          <ImagePlaceholder src={first?.images[0]} alt={product.name[lang]} tint={first?.hex} />
        </div>
        <div className="absolute start-2 top-2 flex flex-col gap-1">
          {product.promoLabel && <span className="rounded bg-promo px-2 py-0.5 text-[10px] font-bold text-promo-foreground">{product.promoLabel[lang]}</span>}
          {product.availability === "out" && <span className="rounded bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{t.common.outOfStock}</span>}
        </div>
      </Link>
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="font-sans text-sm font-medium leading-snug">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:underline">{product.name[lang]}</Link>
        </h3>
        <PriceTag product={product} className="text-sm" />
        <div className="mt-1 flex gap-1" aria-hidden>
          {product.colors.map((c) => <span key={c.key} className="h-3 w-3 rounded-full border" style={{ backgroundColor: c.hex }} />)}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => <ProductCard key={p.slug} product={p} />)}
    </div>
  );
}
