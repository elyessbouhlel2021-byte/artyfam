# ARTYFAM — Frontend ↔ Backend Contract

Status: the storefront is **frontend-only** today. All data comes from mock
files; no backend calls exist yet. This document is the handoff contract for
wiring a real backend later.

## 1. Routes

### Public
| Route | File | Purpose |
|---|---|---|
| `/` | `src/routes/index.tsx` | Home: hero, banner (hidden when none), categories, promo, new/featured/all products (paginated) |
| `/shop` | `src/routes/shop.tsx` | Full catalog with filters, sort, pagination |
| `/category/$slug` | `src/routes/category.$slug.tsx` | Catalog locked to one category |
| `/search` | `src/routes/search.tsx` | Catalog driven by `?q=` |
| `/product/$slug` | `src/routes/product.$slug.tsx` | Product detail: color gallery, size, quantity, add to cart, related |
| `/cart` | `src/routes/cart.tsx` | Cart lines, quantity controls, totals |
| `/checkout` | `src/routes/checkout.tsx` | Simulated checkout form (no real submission) |
| `/order-confirmation/$reference` | `src/routes/order-confirmation.$reference.tsx` | Mock confirmation page |
| `/contact`, `/faq`, `/shipping`, `/returns`, `/privacy`, `/terms` | `src/routes/*.tsx` | Static/policy pages |

### Admin
None. No admin routes exist and no public link may expose `/admin`.

## 2. Types (current mock shapes)

Source of truth today: `src/data/catalog.ts` and `src/data/config.ts`.

```ts
type Lang = "fr" | "it" | "ar";            // backend should add "en"
type L10n = Record<Lang, string>;          // localized text

interface Category { slug: string; name: L10n; image: string | null; popular?: boolean }

interface ColorVariant { key: string; hex: string; name: L10n; images: string[] }

type Availability = "in_stock" | "low" | "out";  // never expose exact counts

interface Product {
  slug: string; name: L10n; description: L10n; category: string;
  price: { TND: number; EUR: number };              // market-specific pricing
  salePrice?: { TND: number; EUR: number };
  promoLabel?: L10n;
  colors: ColorVariant[]; sizes: string[];
  availability: Availability; createdAt: string; featured?: boolean;
}

interface Banner { image: string; title: L10n; subtitle: L10n; ctaHref: string }
interface Promotion { active: boolean; title: L10n; text: L10n; href: string }

interface MarketConfig {
  code: "TN" | "IT"; currency: "TND" | "EUR";
  deliveryFee: number; freeDeliveryThreshold: number | null; regions: string[];
}

interface CartLine { id: string; slug: string; color: string; size: string; qty: number }
// id = `${slug}|${color}|${size}` — variants of one product are distinct lines
```

### Types the backend must add
- **Options/values/variants**: a variant = product + option values (color, size)
  with its own SKU, price override, and stock. The UI currently flattens this
  to `color` + `size` per cart line.
- **Checkout input**: customer name, phone, email (optional), market, region,
  address, shipping method, payment method, coupon code, cart lines.
- **Order**: reference, status (`pending | confirmed | shipped | delivered |
  cancelled`), lines with unit prices, subtotal, delivery fee, discount, total,
  market/currency, timestamps.
- **Return/defect record**: order reference, line, reason, quantity, status.
- **Shipping settings**: per-market fee, free threshold, region list.
- **Stock**: per-variant quantity (admin-only; storefront shows only
  `Availability`).
- **Packs**: grouped products sold as a bundle (not yet in the UI).

## 3. Data each screen needs

| Screen | Data |
|---|---|
| Home | banners (active), categories, active promotion, newest 4, featured 4, paginated catalog |
| Shop/Category/Search | filtered + sorted + paginated products (12/page), filter facets (sizes, colors, price bounds) |
| Product | product by slug, its colors/images/sizes, availability label, related products |
| Cart | product + variant lookup for each line, current prices, market delivery rules |
| Checkout | market regions, shipping/payment methods, coupon validation, order creation |
| Confirmation | order by reference (totals, lines, status) |

## 4. Mock files to replace

- `src/data/catalog.ts` — products, categories, banners, promotions
- `src/data/config.ts` — markets, delivery fees, regions, logo URL, WhatsApp number, contact info
- `src/lib/store.tsx` — localStorage cart → server cart (guest + authenticated, merge on login)
- `src/routes/checkout.tsx` — simulated submit → real order creation

## 5. Expected backend operations

- `listProducts(query, market, page)` — filter/sort/paginate, 12 per page
- `getProduct(slug)` — detail with variants and images
- `validateCoupon(code, cart, market)` — returns discount or error
- `createOrder(checkoutInput)` — server-authoritative totals, idempotency key,
  stock decrement, returns order reference
- `confirmOrder / cancelOrder / markDelivered` (admin) — status transitions
- `recordReturn / recordDefect` (admin)
- `adjustInventory(variantId, delta)` (admin)
- `configureBanners / configurePromotions / configureShipping` (admin)
- `requestDeletion(entity)` (admin) — subject to eligibility rules

## 6. Server-side validation (mandatory)

The frontend must never be trusted for:

- **Prices and totals** — recomputed server-side from current product data.
- **Stock changes** — checked and decremented atomically at order time.
- **Permissions** — every admin operation verified against server-side roles.
- **Order status transitions** — only legal transitions accepted.
- **WhatsApp sending** — initiated server-side once a real integration exists.
- **Deletion eligibility** — e.g. orders with history are archived, not deleted.
