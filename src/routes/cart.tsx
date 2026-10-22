import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/shop";
import { seo } from "@/lib/seo";
import { ImagePlaceholder, PageHeader } from "@/components/store/bits";
import { OrderSummary, useCartLines } from "@/components/store/OrderSummary";
import { QtySelector } from "./product.$slug";

export const Route = createFileRoute("/cart")({
  head: () => seo("Panier", "Votre panier ARTYFAM."),
  component: CartPage,
});

function CartPage() {
  const { t, lang, market, setQty, removeLine, hydrated } = useStore();
  const { lines } = useCartLines();
  const f = (n: number) => formatPrice(n, market, lang);

  return (
    <>
      <PageHeader title={t.cart.title} />
      <div className="container-page py-10">
        {hydrated && lines.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-16 text-center">
            <p className="font-display text-2xl">{t.cart.empty}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t.cart.emptyText}</p>
            <Link to="/shop" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">{t.cart.continue}</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
            <ul className="divide-y rounded-lg border bg-card">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-4 p-4">
                  <Link to="/product/$slug" params={{ slug: l.slug }} className="h-28 w-22 shrink-0 overflow-hidden rounded-md border sm:w-24">
                    <ImagePlaceholder src={l.colorObj?.images[0]} alt={l.product.name[lang]} tint={l.colorObj?.hex} label=" " />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1 text-sm">
                      <Link to="/product/$slug" params={{ slug: l.slug }} className="font-medium hover:underline">{l.product.name[lang]}</Link>
                      <p className="text-muted-foreground">{t.product.color}: {l.colorObj?.name[lang] ?? l.color}</p>
                      {l.size !== "-" && <p className="text-muted-foreground">{t.filters.size}: {l.size}</p>}
                      <p className="text-muted-foreground">{t.cart.unitPrice}: {f(l.price)}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <QtySelector value={l.qty} onChange={(n) => setQty(l.id, n)} />
                      <p className="text-sm font-semibold"><span className="sr-only">{t.cart.lineTotal}: </span>{f(l.total)}</p>
                      <button onClick={() => removeLine(l.id)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />{t.cart.remove}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <OrderSummary>
              <Link to="/checkout" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground">{t.cart.checkout}</Link>
              <Link to="/shop" className="mt-3 block text-center text-sm underline underline-offset-4">{t.cart.continue}</Link>
            </OrderSummary>
          </div>
        )}
      </div>
    </>
  );
}
