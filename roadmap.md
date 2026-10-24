# ARTYFAM Roadmap

## Prompt 3 — Frontend polish (current scope: frontend only, no backend wiring)

- [x] Fix all TypeScript/build errors (strict optional + index-signature issues)
- [x] Brand palette tokens match approved colors (#29281E, #857861, #E7D4BB, #48252F, #101211)
- [x] Verify: 12 products/page, banner hidden when empty, variants as distinct cart lines, RTL, WhatsApp disabled, no inventory counts exposed, no /admin links
- [x] Rule tests: page size, thresholds, sale price, availability labels, variant lines
- [x] Handoff doc: docs/frontend-backend-contract.md
- [ ] Official logo asset — not yet provided; placeholder wordmark remains (set LOGO_URL in src/data/config.ts once supplied)

## Later — Phase 2/3 backend (paused per Prompt 3 "frontend only" scope)

- DB schema + seed (migration SQL already drafted in /tmp, not applied)
- Server functions: catalog queries, coupon validation, place order
- Auth + account pages, server cart, real checkout
- English as 4th language
