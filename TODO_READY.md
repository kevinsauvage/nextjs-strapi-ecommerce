# TODO_READY — production readiness (Petelier · pet dropshipping storefront)

**Date:** 2026-09-26 · **Target:** take real EU orders (ES + FR) from the dropship catalog.

## Where we are today (verified)

| Area           | State                                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Catalog        | 5 pet products synced via Hertwill (plan cap = 5), ACTIVE + published, typed, tagged, inventory synced                                                       |
| Collections    | 9 (All Products, Dogs, Cats, Walk & Travel, Home & Comfort, Play & Enrichment, Feeding, New Arrivals, Made in Europe) with covers/SEO; `custom.featured` set |
| Markets        | `Europe` primary, FR + ES, EUR, VAT-inclusive (`taxesIncluded: true`)                                                                                        |
| Content        | Menus, hero/promo/FAQ, pages (`about-us`, `pet-care`, `faq`), popular searches, shipping + refund policies                                                   |
| Code           | `next build` green, 743/743 tests, coverage 96.8%, eslint/stylelint/prettier clean, CI runs lint+types+tests+build+audit                                     |
| Payments       | ⚠️ **unverified** (no `read_payments` scope)                                                                                                                 |
| Legal identity | ⚠️ shop name is literally `Store name`, `LEGAL_NOTICE` empty, privacy/terms are generic templates                                                            |

**Size legend:** S = ≤ 2 h · M = 0.5–1 day · L = 2–4 days · XL = external dependency / > 1 week

**Priority:** **P0** = cannot legally or commercially take orders · **P1** = launch quality (week 1) · **P2** = first 30 days

---

## P0 — Blockers

### P0-1 Give the business a real legal identity

- **What:** Set the real trade name + company details in Shopify (Settings → Store details, and the _Contact information_ policy): legal company name, NIF/CIF + VAT ID, registered address, support email, phone. Currently every policy and the footer show `Store name`.
- **Why:** EU consumer law (and Spanish law in particular) requires the trader identity to be disclosed before purchase. `Store name` in the footer, policies and emails is an instant trust and legal failure.
- **How:** Shopify Admin → Settings → Store details + Policies → Contact information; then update `NEXT_PUBLIC_SITE_NAME` / `EMAIL` / `PHONE` in `.env.local` **and** Vercel prod env, then `node bin/shopify-navigation.mjs sync`.
- **Size:** S (0.5 h once you have the CIF/VAT number)

### P0-2 Rewrite the legal pages for EU dropshipping

- **What:** Replace the 19 KB generic **Privacy Policy** and **Terms of Service** templates; add: 14-day right of withdrawal, who is the seller of record, where returns go (dropshipper warehouse, not your home address), applicable law, consumer guarantee (2 years), and a **cookie policy** page (the consent banner exists but there is no `/cookies` route).
- **Why:** Dropshipping in the EU without accurate withdrawal/returns/identity info breaches consumer law (Directive 2011/83/EU) and Google Shopping/ads policy; the current text also names the wrong business.
- **How:** Draft from a vetted EU dropshipping template, then `shopPolicyUpdate` via `ShopPolicyInput` (see `bin/` pattern) for privacy/terms; add a `cookie-policy` entry to `content/pages.json` + route in `src/app/(legal)` + footer link.
- **Size:** M (copy + legal review; M if a lawyer reads it)

### P0-3 Fix the contact form

- **What:** `/contact` is dead: `EMAIL_ADDRESS`, `EMAIL_PASSWORD`, `CONTACT_EMAIL` are unset, so the form returns "temporarily unavailable". It is linked in the footer and in the FAQ.
- **Why:** Contact is a trust signal and a legal expectation for EU stores; a dead form loses sales and looks abandoned.
- **How:** Create a Gmail/hosting mailbox + app password, set the 3 vars (or point `CONTACT_EMAIL` at a service that receives mail), verify rate limiting works (Upstash is already configured), then submit a real message.
- **Size:** S (30 min)

### P0-4 Domain + production environment

- **What:** Point a real domain at Vercel (currently `petelier.example`), set SSL, and mirror **all** vars in Vercel prod env: Storefront + Admin tokens, `UPSTASH_*`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SITE_DOMAIN`, `NEXT_PUBLIC_SITE_*`, `NEXT_PUBLIC_GTM_ID`, `HERTWILL_API_KEY`, `EMAIL_*`, `ERROR_REPORTING_URL`.
- **Why:** Canonical URLs, cookies, sitemap, emails and CWV all depend on the real domain; the test `.env.local` is not deployed anywhere.
- **How:** Add domain in Vercel → set env per branch (Preview + Production) → redeploy → verify `getBaseUrl()` output in metadata and that no secret is exposed to the client.
- **Size:** M

### P0-5 Catalog depth — the real commercial blocker

- **What:** Hertwill's plan caps product syncs at **5**. 276 EU pet products are available and only 5 are live; Labbvenn (124) and Wicker Stories (50) additionally need brand approval in the Hertwill dashboard.
- **Why:** A 5-SKU shop cannot rank, cannot cross-sell and reads as a placeholder. This is the difference between "demo" and "store".
- **How:** Upgrade the Hertwill plan → request access on the Labbvenn and Wicker Stories brand pages → once approved: `node bin/hertwill-catalog.mjs sync` → `node bin/hertwill-import.mjs run --all` → `node bin/shopify-curate-pets.mjs apply --all` → `node bin/shopify-collections.mjs --confirm`.
- **Size:** XL (plan upgrade + supplier approval is outside the codebase)

### P0-6 Verify payments for ES + FR

- **What:** Confirm the payment gateways are enabled and settled in EUR for both markets (Shopify Payments/Adyen/PayPal/Apple-Google Pay), with 3DS enabled for EU.
- **Why:** If a gateway is missing for FR, checkout fails at the last step and you lose the order. Unverifiable from this repo (no `read_payments` scope) — must be done in Admin.
- **How:** Admin → Settings → Payments; then a real low-value transaction in each market + a failed-3DS test.
- **Size:** S (30 min) + 1 h testing

### P0-7 Place a real end-to-end order (ES and FR)

- **What:** Buy one product in the Spain market and one in France, tracked delivery address + card.
- **Why:** Validates the only path that makes money: cart → checkout → Shopify order → Hertwill fulfillment → tracking email → invoice. Also confirms the `Hertwill Shipping` rate (€16.82 seen) and the free-shipping threshold behaviour.
- **How:** Full manual pass on the production URL; capture the order IDs, delivery estimate, VAT line, invoice PDF and the dropshipper's dispatch time; add the result to the refund/FAQ copy if it differs.
- **Size:** S (1 h)

### P0-8 Error + uptime monitoring

- **What:** `ERROR_REPORTING_URL` is unset, so `reportError()` only logs to the server console; nobody is paged when checkout breaks.
- **Why:** Dropship margins are thin — a broken cart or a 500 on a PDP destroys the day's profit silently.
- **How:** Point the var at Sentry/OTel collector (or Vercel log drain), add a `reportError` alert to Slack/email, and enable Vercel uptime/failed-function alerts.
- **Size:** M

### P0-9 Brand assets

- **What:** Ship a real logo/wordmark, OG image, favicon and social preview; `NEXT_PUBLIC_SITE_LOGO*` and socials still point at example values.
- **Why:** The header currently renders a text wordmark; share previews and emails will look unbranded, and the logo is a legal-identity surface.
- **How:** Design a minimal wordmark + mark, export SVG/PNG, set `NEXT_PUBLIC_SITE_LOGO`, `..._SQUARE`, favicon, and a 1200×630 OG image used by `generateMetadata`.
- **Size:** M (design S, wiring S)

---

## P1 — Launch quality (week 1)

### P1-1 Language strategy for ES/FR — implemented (path-based locales)

- **What:** The storefront is served in **en / es / fr** with the locale in the path. Every page lives under `src/app/[locale]/`; English is canonical at the root (`/collections/dogs`), the others behind a prefix (`/es/collections/dogs`). `src/proxy.ts` rewrites unprefixed URLs to `/en/...` internally (so `/collections` and `/collections` are one route with one URL), redirects `/en/...` back to the unprefixed form, and sends a non-English visitor arriving on a root URL to their own prefix via cookie → `Accept-Language` → default. `next-intl` supplies the message catalogs; `src/i18n/` holds the locale primitives, the three typed catalogs and the server helpers.
- **Why:** Markets are already ES/FR. Header-driven locales made the whole shell render per request and gave Google no per-language URL, so a third of the intended traffic was effectively unindexable.
- **How (done):** locale resolved from route params (`localeFromParams`) and threaded explicitly into `getStorefront`/`contentLanguage`/`getTranslations`/`cmsSections`, so **each language prerenders independently** — build output: home, collections index, legal pages and wishlist are `○ (Static)` per locale, collection/PDP/search are `◐ (Partial Prerender)`, and **no route is `ƒ` (fully dynamic)**. Internal links go through `LocalizedLink`, which re-applies the visitor's locale (verified: no unprefixed internal href survives on a Spanish page). `hreflang` alternates + per-locale canonical come from `generateMetadataUtil({ locale })`, and the sitemap and robots.txt expand every path across the three locales.
- **Size:** L. Three platform workarounds, all documented in code:
  - `bin/shopify-translations.mjs` writes **one locale map per metaobject field** (`{"en","es","fr"}`) because the Storefront API does not resolve `@inContext` for metaobject fields; `selectLocalizedValue` picks the entry. The default language is merged into the same call — writing translations without it wipes the English copy.
  - Collection names are applied from the manifest by `localizedCollection*` (`src/lib/server/localized-content.ts`). Shopify only serves translated `menu`/`collection`/`product` content once the shop locale is enabled on a **market web presence**: `MarketCreateInput`/`MarketUpdateInput` have no `locales`, but `shopLocaleUpdate(locale, { marketWebPresenceIds })` sets them, and `bin/shopify-translations.mjs locales` now applies it. With that enabled, `@inContext(language:)` returns translated collections and menu items natively (verified); the manifest layer stays for metaobject fields and product/page bodies, which Shopify still does not resolve.
  - Next's generated route types only accept locale-prefixed paths, so unprefixed canonical paths cannot type-check as `Route`. The assertions live in exactly two places — `LocalizedLink` and `useLocalizedPush` (`src/i18n/client.ts`); `config.routes` and `src/utils/url.ts` return `RoutePath` instead of scattering casts. This is a deliberate, documented relaxation of the old `satisfies Record<string, Route>` rule.
- **Menu labels (done):** a menu item is translatable as a `LINK` resource under the same numeric id (`MenuItem/<n>` → `Link/<n>`); `bin/shopify-translations.mjs` registers the `menuItems` manifest against it, and enabling the locale on the market web presence makes `@inContext(language:)` return them (verified: `Tienda/Ayuda/…` and `Boutique/Aide/…` in the header and footer). Product titles on the PDP use the same manifest helper; product _descriptions_ and page bodies remain English.
- **Server-action + client feedback (done):** `src/data/userFeedback.ts` holds the en/es/fr strings for every authored toast, form error and rate-limit notice; actions resolve the locale with `getCurrentLocale()`, services take an explicit trailing `feedback` (English default, so tests are unaffected), and the two contexts read it from `useRenderedLocale()`. Still English by design: zod's built-in messages (`emailField`, `passwordField`), Shopify passthrough errors, and `CartService` outage throws.
- **UI sweep (done):** the last English strings on `/es/*` and `/fr/*` are gone — `formatDate` is locale-aware, order badges, wishlist/account/search/collection/pagination chrome, the home hero fallbacks, `EmptyState` tips, predictive-search section titles and the collection/PDP/shared-wishlist metadata fallbacks all resolve from the catalogs. Two guards keep it that way: `src/i18n/usage.test.ts` fails the build if a component dereferences a key that does not exist in `en`, and `messages.test.ts` enforces es/fr parity. English by design: `src/app/global-error.tsx` and `global-not-found.tsx` (they render outside `[locale]`, so no locale is in scope — localizing them means a client-side provider that survives a root-layout crash), the `Website` honeypot in the contact form (bot trap, `aria-hidden`), and the `ui/button|dialog|sheet` sr-only `Loading…`/`Close` labels (leaf primitives must not depend on the message provider — see the `/_not-found` prerender crash).
- **Follow-ups (not blocking):** `NEXT_PUBLIC_BASE_URL` still points at the dev origin, so canonical/hreflang URLs must be re-checked once the real domain is set; `/es/…` and `/fr/…` product/collection translations still depend on the market item above.

### P1-2 Redirect the old fashion URLs

- **What:** 1,349 products + 22 collections were deleted. Any indexed/backlinked fashion URL now 404s.
- **Why:** 404s waste crawl budget and lose backlink equity exactly when you need ranking.
- **How:** Shopify Admin → Navigation → URL redirects: `collections/dresses|tops|outerwear|...` → `/collections/all-products`; old product handles → nearest collection. Verify with `Search Console → Pages`.
- **Size:** S

### P1-3 E-commerce analytics + conversion tracking

- **What:** GTM loads behind consent ✅, but there are no store events — no `view_item`, `add_to_cart`, `begin_checkout`, `purchase`. Growth decisions would be blind.
- **Why:** You cannot scale dropship margin without knowing conversion rate, AOV and which collection drives revenue (see `GROWTH_PLAN.md` P0).
- **How:** Push `dataLayer` events from the existing client components (product view, add to cart, checkout click, Shopify order-created webhook → purchase) and build the GA4/GTM report; respect the existing consent gate.
- **Size:** L

### P1-4 Product SEO + compliance data on the PDP

- **What:** Products arrive from Hertwill with a shared description blob; no per-product SEO title/description, no alt text pass, no GPSR manufacturer/responsible-person block.
- **Why:** EU product safety (GPSR) requires the responsible economic operator to be identifiable, and generic supplier copy is a ranking and conversion killer.
- **How:** Extend `bin/shopify-curate-pets.mjs` to write `seo` + a `custom.gpsr` metafield from the brand `gpsr` block already returned by `GET /v1/brands/{id}`; render it in `ProductDescription.tsx`.
- **Size:** M

### P1-5 Accessibility + contrast pass

- **What:** The palette, fonts (Fraunces) and layouts changed; no automated a11y audit has been run.
- **Why:** WCAG 2.1 AA is also a legal expectation in the EU; the previous palette was never audited and the new one is new.
- **How:** axe/Lighthouse on home, collection, PDP, cart, checkout handoff; check `--gold` on `--background` (sage on cream ≈ 7:1) and dark mode; fix focus rings, headings, and the delivery-estimate form labels.
- **Size:** M

### P1-6 Performance budget + Core Web Vitals

- **What:** No perf budget or CWV monitoring; no measurement of the store with a real (276-product) catalog.
- **Why:** LCP/INP drive organic ranking and ad efficiency; the hero image is LCP and product grids are the heaviest part of the page.
- **How:** Set budgets in `next.config.ts`/CI, run Lighthouse against production on 4G, add CWV reporting (`@vercel/speed-insight` or GTM), re-measure with the full catalog and the heaviest collection page.
- **Size:** M

### P1-7 Customer-account + transactional email

- **What:** Order confirmation, shipping and refund emails use Shopify defaults; sender domain and templates are not branded, and the newsletter has no double opt-in.
- **Why:** These are the highest-open-rate messages a store sends; a `Store name` sender kills trust and can land in spam.
- **How:** Verify SPF/DKIM on the sending domain, brand the templates, set the sender name, and confirm order-status notifications for dropshipped orders.
- **Size:** M

### P1-8 Merch & content hygiene

- **What:** `/subscription` route and policy still exist although the shop has no subscriptions; `README.md`, `GROWTH_PLAN.md` and the `docs/SHOPIFY.md` launch checklist still describe the fashion store; `bin/` import tooling has no unit tests.
- **Why:** Stale docs cause wrong decisions; the subscription policy is a legally empty page.
- **How:** Remove the subscription route/policy, rewrite the docs sections, add `src/utils/pricing.test.ts` for the tiered `.90` rounding (currently only covered indirectly).
- **Size:** S

### P1-9 Security hardening

- **What:** The Admin token is broad (`write_products`, `write_markets`, `write_content`, `write_legal_policies`) and lives in the same `.env.local` as dev credentials; rate limits exist for cart/contact but were never load-tested.
- **Why:** A leaked Admin token means a full store takeover; dropship stores get scraped and abused.
- **How:** Scope a separate prod token, rotate keys before launch, confirm `src/proxy.ts` + `rate-limit.ts` behaviour under a quick load test, and re-check the CSP allowlist in `next.config.ts` now that images come from the shop.
- **Size:** M

---

## P2 — First 30 days after launch

### P2-1 Journal / editorial content engine

- **What:** `docs/BRAND.md` lists a **Journal** nav item that does not exist.
- **Why:** It is the on-brand growth channel for a curated-lifestyle brand and the natural home for SEO content.
- **How:** Add a `/journal` route + Shopify blog/collection, seed 3–5 posts on sizing, care and "why we chose these brands", then add it to the menu.
- **Size:** L

### P2-2 Email lifecycle

- **What:** Only a footer newsletter signup exists.
- **Why:** Welcome, abandoned cart and post-purchase flows are the cheapest revenue for a thin-margin dropshipper.
- **How:** Shopify Email (or Klaviyo) flows triggered on the events from P1-3; GDPR double opt-in.
- **Size:** M

### P2-3 Reviews + social proof

- **What:** Testimonials on the home page are hand-written; no real review system.
- **Why:** Real reviews are the top conversion lever for an unknown brand.
- **How:** Judge.me/Loox app, or Shopify product metafield reviews rendered on the PDP; add `AggregateRating` to the product JSON-LD.
- **Size:** M

### P2-4 Webhook cache purge

- **What:** Product/stock changes are only visible after the 600 s revalidation window.
- **Why:** Sold-out or price changes lag, so customers hit checkout failures on stale data.
- **How:** Shopify webhooks → a Vercel/edge route calling `revalidateTag` (the cache tag infrastructure already exists).
- **Size:** M

### P2-5 Merchandising + unit economics

- **What:** Free-shipping threshold (€80) is a code constant; no bundles, cross-sell or upsells; no margin report per product.
- **Why:** AOV and contribution margin per order decide whether the store survives.
- **How:** Move the threshold to a metafield, add "complete the set" recommendations, and build a margin report from the Hertwill catalog (`content/hertwill-pet-catalog.json` + variant prices).
- **Size:** L

### P2-6 Reliability & operations

- **What:** No on-call runbook, no alert thresholds, no order/backup export.
- **Why:** Dropship fulfilment failures are only visible if someone watches.
- **How:** Short runbook (failed sync, out-of-stock, bad price, refund abuse), scheduled order export, and a weekly health check using the `bin/` scripts (`hertwill:status`, `collections`).
- **Size:** M

### P2-7 Expand markets

- **What:** ES + FR only.
- **Why:** BRAND.md targets the EU as a whole; growth beyond two countries needs VAT/OSS registration and a shipping rate per market.
- **How:** Add markets in Admin, add a shipping profile per market, register for OSS if selling cross-border B2C, then enable `de`/`it` locales.
- **Size:** XL (registration is external)

### P2-8 Test & quality debt

- **What:** Coverage is 96.8% but the floor is 35/74/68; no e2e/smoke suite; the import/pricing scripts are untested.
- **Why:** Raising the floor protects the checkout-critical paths that generate revenue.
- **How:** Raise thresholds gradually, add unit tests for `computePrice`/`classify`, and a Playwright smoke test (home → PDP → add to cart → estimate shipping).
- **Size:** M

---

## Launch gate (go/no-go)

1. Every **P0** is done, especially: real identity, EU policies, working contact form, live domain + prod env, payments verified, and **one successful real order in ES and one in FR**.
2. `yarn lint && yarn format:check && yarn typegen && yarn lint-ts && yarn test:coverage && yarn lint:css` green, and CI green on `main`.
3. Storefront spot-check on the production domain: home, a collection, a PDP, cart with shipping estimate, and `/contact`.
4. `node bin/hertwill-import.mjs status` shows all intended products `synced` (no `approval-required`).
5. Order + refund emails land in the inbox with the correct sender and VAT-inclusive totals.
