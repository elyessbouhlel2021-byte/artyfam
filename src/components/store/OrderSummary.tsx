import { useStore } from "@/lib/store";
import { getProduct } from "@/data/catalog";
import { cartTotals, formatPrice, unitPrice } from "@/lib/shop";

export function useCartLines() {
  const { cart, market } = useStore();
  const lines = cart.flatMap((l) => {
    const p = getProduct(l.slug);
    if (!p) return [];
    const price = unitPrice(p, market);
    return [{ ...l, product: p, colorObj: p.colors.find((c) => c.key === l.color), price, total: price * l.qty }];
  });
  const totals = cartTotals(lines.reduce((s, l) => s + l.total, 0), market);
  return { lines, totals };
}

export function OrderSummary({ children }: { children?: React.ReactNode }) {
  const { t, market, lang } = useStore();
  const { totals } = useCartLines();
  const f = (n: number) => formatPrice(n, market, lang);
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 font-sans text-base font-semibold">{t.checkout.summary}</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt>{t.cart.subtotal}</dt><dd>{f(totals.subtotal)}</dd></div>
        <div className="flex justify-between"><dt>{t.cart.delivery}</dt><dd>{totals.delivery === 0 && totals.subtotal > 0 ? t.cart.free : f(totals.delivery)}</dd></div>
        <div className="flex justify-between border-t pt-3 text-base font-semibold"><dt>{t.cart.total}</dt><dd>{f(totals.total)}</dd></div>
      </dl>
      {totals.threshold != null && !totals.free && totals.subtotal > 0 && (
        <p className="mt-4 rounded-md bg-surface p-3 text-xs text-muted-foreground">
          {t.cart.remaining.replace("{amount}", f(totals.threshold - totals.subtotal))}
        </p>
      )}
      {totals.threshold != null && (
        <p className="mt-2 text-xs text-muted-foreground">{t.cart.freeFrom} {f(totals.threshold)}</p>
      )}
      {children}
    </div>
  );
}
