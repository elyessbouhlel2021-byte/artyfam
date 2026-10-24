import { products, type Lang, type Product } from "@/data/catalog";
import { MARKETS, PAGE_SIZE, type MarketCode } from "@/data/config";

const LOCALES: Record<Lang, string> = { fr: "fr", it: "it", ar: "ar" };

export function formatPrice(amount: number, market: MarketCode, lang: Lang) {
  const currency = MARKETS[market].currency;
  return new Intl.NumberFormat(`${LOCALES[lang]}-${market}`, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "TND" ? 3 : 2,
    maximumFractionDigits: currency === "TND" ? 3 : 2,
    numberingSystem: "latn",
  }).format(amount);
}

export function unitPrice(p: Product, market: MarketCode) {
  const cur = MARKETS[market].currency;
  return p.salePrice ? p.salePrice[cur] : p.price[cur];
}

export interface CatalogQuery {
  q?: string | undefined;
  cat?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  size?: string | undefined;
  color?: string | undefined;
  promo?: boolean | undefined;
  sort?: "newest" | "price_asc" | "price_desc" | undefined;
  page?: number | undefined;
}

export function queryCatalog(query: CatalogQuery, market: MarketCode) {
  const q = query.q?.trim().toLowerCase();
  let list = products.filter((p) => {
    if (q && !Object.values(p.name).some((n) => n.toLowerCase().includes(q))) return false;
    if (query.cat && p.category !== query.cat) return false;
    const price = unitPrice(p, market);
    if (query.min != null && price < query.min) return false;
    if (query.max != null && price > query.max) return false;
    if (query.size && !p.sizes.includes(query.size)) return false;
    if (query.color && !p.colors.some((c) => c.key === query.color)) return false;
    if (query.promo && !p.salePrice) return false;
    return true;
  });
  const sort = query.sort ?? "newest";
  list = [...list].sort((a, b) =>
    sort === "price_asc" ? unitPrice(a, market) - unitPrice(b, market)
    : sort === "price_desc" ? unitPrice(b, market) - unitPrice(a, market)
    : b.createdAt.localeCompare(a.createdAt),
  );
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, query.page ?? 1), pages);
  return { items: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total, pages, page };
}

export function parseCatalogSearch(s: Record<string, unknown>): CatalogQuery {
  const num = (v: unknown) => (v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  const sort = str(s["sort"]);
  return {
    q: str(s["q"]) ?? (typeof s["q"] === "number" ? String(s["q"]) : undefined),
    cat: str(s["cat"]),
    min: num(s["min"]),
    max: num(s["max"]),
    size: str(s["size"]) ?? (typeof s["size"] === "number" ? String(s["size"]) : undefined),
    color: str(s["color"]),
    promo: s["promo"] === true || s["promo"] === 1 || s["promo"] === "1" ? true : undefined,
    sort: sort === "price_asc" || sort === "price_desc" || sort === "newest" ? sort : undefined,
    page: num(s["page"]),
  };
}

export function cartTotals(subtotal: number, market: MarketCode) {
  const m = MARKETS[market];
  const free = m.freeDeliveryThreshold != null && subtotal >= m.freeDeliveryThreshold;
  const delivery = subtotal === 0 || free ? 0 : m.deliveryFee;
  return { subtotal, delivery, total: subtotal + delivery, free, threshold: m.freeDeliveryThreshold };
}
