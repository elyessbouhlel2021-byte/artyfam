# ARTYFAM Phase 2/3 — Functional Storefront

- [ ] 1. DB schema: categories, products, options/values, variants, images, coupons, shipping/payment methods, profiles, addresses, wishlist, carts, orders (+ RLS, grants)
- [ ] 2. Seed migration porting the Phase 1 catalog (34 products, variants, prices) with EN added
- [ ] 3. Server functions: public catalog queries, cart validation, coupon validation, place order (server-authoritative totals, idempotency, stock decrement)
- [ ] 4. Auth: email/password + Google + Lovable sign-in, account pages (profile, addresses, wishlist, orders)
- [ ] 5. Cart service layer: guest + authenticated carts, merge on login, revalidation
- [ ] 6. Checkout: real submission, shipping/payment methods, double-submit guard, confirmation from backend reference
- [ ] 7. i18n: add English (4th language), translate validation/errors/statuses
- [ ] 8. Frontend rewiring: catalog/search/category/product/cart/checkout read from backend; remove demo data
- [ ] 9. Tests: cart ops, variants, coupons, totals, double-submit, isolation
