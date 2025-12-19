# Project TODO (prioritized)

Legend:

- **P0**: correctness/security issues (fix before production)
- **P1**: high-impact improvements (strongly recommended)
- **P2**: quality/performance/SEO improvements
- **P3**: polish / nice-to-have

## P0 — Correctness & security

- **Harden Shopify Admin usage**
  - Validate `SHOPIFY_STORE_FRONT_ADMIN_TOKEN` + `SHOPIFY_ADMIN_URL` when Admin features are used
  - Make failures explicit (avoid silent empty-string endpoint usage)

## P1 — Product integrity & core UX

- **Improve error handling patterns**
  - Replace `throw` inside loops / server actions with structured error returns where possible
  - Add consistent error boundary messaging for common failures (Shopify/API/cookies)
- **Sitemap coverage**
  - Add dynamic URLs (collections, products) using Shopify data (and include lastModified if available)

## P2 — DX, tests, CI/CD

- **Add automated tests**
  - Unit tests for utils/helpers (cart helpers, cookies, consents)
  - Integration tests for server actions (auth/cart) with mocked Shopify SDK
  - E2E smoke tests (home → collection → product → add to cart → checkout start)
- **Add CI pipeline**
  - Run `lint`, `lint-ts`, `lint:css`, and tests on PRs
  - Add caching for dependencies + codegen where appropriate
- **Env validation**
  - Add a small env schema (Zod) and validate on boot for both server-only and public env vars

## P3 — Performance, SEO, maintainability polish

- **Next/Image configuration**
  - Revisit `images.unoptimized: true` (enable optimization if hosting supports it)
- **Observability**
  - Add structured logging (request ids, operation names) and optional error reporting (Sentry, etc.)
