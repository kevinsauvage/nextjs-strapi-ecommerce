# Shopify Growth Plan — Prioritized Roadmap

> Verified against the working tree on **2026-09-25** with `graft`
> (`graft_repo_map` + call-site search, 313 files / 1581 symbols) and by reading
> the hand-written `.graphql` documents. Every "dead"/"shipped" claim below was
> checked against real call sites, **excluding** the generated
> `src/shopify/{storefront,admin}/index.ts`. Re-verify after `yarn codegen`.

## 1. TL;DR

| Area                               | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shipped                            | Catalog, collections (filters/sort), cart (lines, note, gift cards, discount codes, attributes), checkout redirect, auth (login/register/recover/reset/activate), account (profile, addresses, orders + detail/tracking), Pages CMS, navigation CMS, metaobject popular searches, wishlist (guest → login merge, share, move-to-cart), recently viewed, best sellers, predictive + full search, newsletter, contact form, legal policies, JSON-LD (Organization/WebSite/Breadcrumb/Collection/Product), sitemap (products/collections/pages); metaobject CMS sections (hero, promo bar, size chart, FAQ) |
| Genuinely unwired                  | Blog/articles, Markets/localization, product media (video/3D), selling plans, bundles, modern cart delivery (delivery groups/pickup), automatic-discount surfacing, Multipass (Plus-only)                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Missing from the original plan** | On-demand cache purge webhooks, Enhanced Ecommerce measurement, error monitoring, i18n SEO plumbing (hreflang/canonical/localized sitemap), email lifecycle, performance budget                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Biggest lever                      | **Measurement first**, then content-led SEO, then Markets. You cannot grow what you do not measure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Build order                        | **P0** measure + purge → **P1** blog, markets, metaobject sections, promo, reviews → **P2** subscriptions, bundles, delivery/pickup, loyalty, email → **P3** SSO, returns, AI search, PWA                                                                                                                                                                                                                                                                                                                                                                                                                |

## 2. Corrections to the previous plan

These are things the previous version got **wrong, redundant, or understated** —
do not carry them forward.

1. **"Customer metafields still unwired" — misleading.** The generic capability
   _is_ wired: `WishlistService.getWishlistState()` reads `custom.wishlist` via
   `getCustomer` with `metafields(identifiers:)`
   (`src/services/wishlist.service.ts:100`, `customer.graphql:217`). The
   standalone `getCustomerMetafields` query is just a **narrower duplicate** of
   what `getCustomer` already does — delete it, or use it, but it is not a new
   P1 capability surface.

2. **`checkoutURL` query is redundant, not a markets prerequisite.** The
   localized checkout URL is already returned by `Cart.checkoutUrl`, which is in
   the `CartFields` fragment (`fragments.graphql:213`) and used by
   `CheckoutButton` through `CartSummary`. Threading `@inContext` is what
   localizes it; the extra query adds nothing. **Delete it.**

3. **`getShop` is also dead** and was missing from the audit list (0 call sites
   outside generated). Decide: wire (shop description/metadata) or delete.

4. **Pickup/delivery was described with a deprecated API.** The previous plan
   pointed at cart **buyer identity delivery address**, but
   `buyerIdentity.deliveryAddressPreferences` is **deprecated as of 2025-01**
   (schema note in `storefront/index.ts:857`), and the codebase still queries it
   (`fragments.graphql:173`). The current path is
   `cartDeliveryAddressesAdd/Update/Remove` + `cart.deliveryGroups.deliveryOptions`
   - `cartSelectedDeliveryOptionsUpdate` (+ `CartDeliveryPreference.pickupHandle`).

5. **Multipass is a Shopify Plus feature.** It was listed as a generic P2. Label
   it Plus-only; if the store is not Plus, **delete
   `customerAccessTokenCreateWithMultipass`** rather than keeping it as a tease.

6. **`getBlogByHandle` is far from ready.** It returns only `articles(first: 5)`
   with `id` + `title` (`shopQueries.graphql:152-165`) — no handle, excerpt,
   image, author, tags, or `publishedAt`, and no pagination. Building `/blog`
   needs a **new** query (or a substantial rewrite), not "add an articles
   sub-query".

7. **`getLocalization` is incomplete for a switcher.** It lacks
   `availableLanguages` and the active `language`
   (`storefront/index.ts:5085-5105`). Add them before shipping a switcher.

8. **Sprint order was internally inconsistent.** §4 listed Sprint 4 as
   "P1 #5–#6" while §3 #5 (wishlist hardening) was struck through as shipped.
   Internet-facing build order below is rebuilt from scratch.

9. **Measurement was under-prioritized.** GTM Enhanced Ecommerce was P1 #6,
   below content and markets. For a _growth_ plan it is **P0**: today the app
   fires exactly one analytics event, `search` (`src/lib/client/analytics.ts:44`),
   so `view_item`, `add_to_cart`, `begin_checkout`, and `purchase` funnels are
   invisible.

10. **Reviews wording is correct** (Shopify has no native Storefront reviews
    object — app/metaobject + aggregate-rating JSON-LD is the right approach).
    Keep, but add the legal/consent implication and provider decision as a gate.

## 3. Ground-truth Shopify API audit

### 3.1 Dead Storefront operations — wire or delete

Defined in `.graphql`, present in the generated SDK, **zero call sites** in
hand-written code.

| Operation (file)                                              | Reality                                                                 | Recommendation                                                                                |
| ------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `getBlogByHandle` (`shopQueries.graphql`)                     | Query too thin for a real blog                                          | **P1** rewrite + build `/blog`, `/blog/[handle]`; add articles to sitemap + `Article` JSON-LD |
| `getShopMetaobjectByHandle` (`shopQueries.graphql`)           | Single-item metaobject; `getShopMetaObjects` (used) is the list variant | **P1** keep — it is the right primitive for hero/promo/size-chart **sections**                |
| `getLocalization` (`shopQueries.graphql`)                     | Missing `availableLanguages`/`language`                                 | **P1** extend, then Markets/i18n                                                              |
| `checkoutURL` (`cart.graphql`)                                | Duplicate of `Cart.checkoutUrl`                                         | **Delete now**                                                                                |
| `getCustomerMetafields` (`customer.graphql`)                  | Duplicate of `getCustomer(metafields:)`                                 | **Delete now** (or fold into the existing call)                                               |
| `getShopProductTags` (`shopQueries.graphql`)                  | Tag cloud / landing pages                                               | **P2 optional**; delete if no plan                                                            |
| `getShop` (`shopQueries.graphql`)                             | Nothing reads shop description/brand                                    | **Decide**: wire into metadata or delete                                                      |
| `customerAccessTokenCreateWithMultipass` (`customer.graphql`) | Plus-only                                                               | **Delete unless Plus SSO is committed**                                                       |

### 3.2 Capabilities the schema exposes but the app never models

All confirmed present in the generated 2026-07 schema.

| Capability                                                                                                                            | Current state                                                    | Opportunity                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Cart delivery groups** (`cart.deliveryGroups`, `CartDeliveryOption`, `cartSelectedDeliveryOptionsUpdate`, `cartDeliveryAddresses*`) | Not queried; only deprecated `deliveryAddressPreferences`        | P2 — shipping estimator + pickup selection before checkout           |
| **Cart metafields** (`cartMetafieldsSet`, `CartInput.metafields`)                                                                     | Cart uses `attributes` (`cart.graphql`)                          | P2 — structured gift/personalization data that survives to the order |
| **Selling plans** (`sellingPlanGroups`, `CartLineInput.sellingPlanId`)                                                                | Not queried                                                      | P2 — subscriptions/pre-orders                                        |
| **Bundles** (`ProductVariant.components`/`requiresComponents`/`groupedBy`, componentizable cart lines, `parent`)                      | Not queried                                                      | P2 — fixed bundles / shop-the-look                                   |
| **Product media** (video, 3D)                                                                                                         | `ProductFields` only has `images`                                | P2 — media gallery upgrade                                           |
| **Automatic discounts** (`CartAutomaticDiscountAllocation` in `cart.lines[].discountAllocations`)                                     | Fragment reads only `discountedAmount` + `targetType`            | P1 — surface auto-applied savings + promo banner                     |
| **Blog / articles** (`blog`, `blogs`, `article`, `articles`)                                                                          | Unused                                                           | P1 — content-led SEO                                                 |
| **Localization `availableLanguages`/`language`**                                                                                      | Unused                                                           | P1 — language + currency switcher                                    |
| **Predictive search types** (`ARTICLE`, `PAGE`, …)                                                                                    | Only products/collections/queries requested (`search.graphql:2`) | Follows blog (P1)                                                    |

> Note: **Do not** put merchant commerce data in localStorage as a substitute for
> Shopify state (the wishlist/guest pattern is fine because it re-merges on
> login). Cart data stays server-side.

### 3.3 Correctness debt to fix alongside the roadmap

- `BuyerIdentityFields.deliveryAddressPreferences` (`fragments.graphql:173`) is
  deprecated — migrate to `cart.deliveryGroups` when picking up delivery (P2),
  and remove the field then.
- Public reads are cached for `revalidate.shopify = 600`s under tag `shopify`
  (`src/config/index.ts:11`, `src/shopify/index.ts:49-51`) with **no purge
  webhook**, so `content:seed` / `navigation:sync` are stale up to 10 minutes
  (documented in README). This is a P0 operational gap, not a nice-to-have.

### 3.4 Admin API — lightly used, keep it server-only

Currently: `delegateAccessTokenCreate`, `MetafieldsSet` (wishlist),
`NewsletterSubscribe` → `customerCreate` (`src/shopify/admin/customer.graphql`).
Legitimate untapped, server-side-only uses (each needs scope review per
`AGENTS.md` "Ask first"):

- **Webhook subscription CRUD** (`webhookSubscriptionCreate`) for cache purge.
- **Inventory levels** (`inventoryItem`/`inventoryLevel`) for pickup feasibility
  pre-check (needs `read_inventory`).
- **Customer tags / segments** for lifecycle + loyalty reconciliation.
- **Order/refund reads** for self-serve returns (P3).

## 4. What the original plan was missing

1. **On-demand cache invalidation (P0).** A signed webhook route handler that
   maps `products/update`, `collections/update`, `pages/update`,
   `articles/update`, `metaobjects/update` → `revalidateTag('shopify', 'max')`.
   The client wrapper already expects it; without it every publish has a 10-min
   blind spot and markets/blog content feels broken.
2. **Enhanced Ecommerce + consent (P0).** Add `view_item`, `add_to_cart`,
   `begin_checkout`, `view_cart` to the `dataLayer` via a typed helper next to
   `trackSearch`; capture `purchase` through a **Shopify web pixel / checkout
   extension** (hosted checkout) or an `orders/paid` webhook. Keep the existing
   consent-mode default and do not fire before consent.
3. **Error monitoring (P1).** `reportError` already funnels to an optional
   `ERROR_REPORTING_URL` webhook (`src/lib/server/error-reporter.ts`), but there
   is no APM. Swap in Sentry (or similar) via `setErrorReporter`; alert on
   GraphQL failure rate and checkout errors.
4. **i18n SEO plumbing (P1).** Markets is not just a switcher: canonical URLs,
   `hreflang` alternates, `lang` on `<html>`, locale-aware sitemap, and a
   path-vs-cookie IA decision.
5. **Email lifecycle (P2).** Newsletter captures customers, but there is no
   welcome, abandoned-cart, or post-purchase flow. Provider decision (Shopify
   Email / Klaviyo) then wire the events (they depend on P0 measurement).
6. **Performance budget (P1/P2).** `images.unoptimized: true`
   (`next.config.ts:119`) is intentional because Shopify CDN already serves
   WebP transforms (`ImageFields` in `fragments.graphql:399-413`) — so treat
   this as _working as designed_, not a bug. Still add a Core Web Vitals budget
   (LCP/INP/CLS) and a bundle-size check so the roadmap does not regress it.
7. **Legal/consent for new data (gates).** Reviews, loyalty points, and market
   cookies all add personal data; update the privacy policy + consent copy in
   the same PR that ships them.

## 5. Prioritized roadmap

### P0 — Instrument and unblock operations (1 sprint)

| #   | Item                                                                                                                  | API / files                                                                    | Done when                                                                  | Metric                              |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------------- |
| 0.1 | GTM Enhanced Ecommerce (+ consent-safe `purchase` via web pixel)                                                      | `src/lib/client/analytics.ts`, PDP/cart components, checkout extension         | GA4 debug view shows `view_item`/`add_to_cart`/`begin_checkout`/`purchase` | Funnel completion, add-to-cart rate |
| 0.2 | Signed Shopify webhook → `revalidateTag('shopify', 'max')`                                                            | new `src/app/api/webhooks/shopify/route.ts`, Admin `webhookSubscriptionCreate` | Content publish is live < 30 s                                             | Publish-to-live latency             |
| 0.3 | Delete redundant ops (`checkoutURL`, `getCustomerMetafields`, and `getShop`/`getShopProductTags`/Multipass if unused) | `.graphql` + `yarn codegen`                                                    | Zero unused generated methods                                              | API surface size                    |

### P1 — Demand capture and reach (2–3 sprints)

1. **Blog / journal** — rewrite `getBlogByHandle` into a paginated article query,
   add `/blog`, `/blog/[handle]`, article cards, related posts, sitemap entries,
   `Article` JSON-LD, and `robots`/metadata. Register routes in
   `src/config/index.ts`.
2. ~~**Metaobject CMS sections**~~ — **Shipped**: `hero_section`, `promo_bar`,
   `size_chart`, `faq_section`/`faq_item` read by `src/lib/server/cmsSections.ts`
   (hero + promo fall back to the built-in content, size chart renders in the PDP
   accordion, FAQ as a homepage accordion); authored via
   `yarn sections:ensure|seed` from `content/sections.json`; handles documented in
   README.
3. **Markets / i18n** — extend `getLocalization` (`availableCountries`,
   `availableLanguages`, `language`), add country/language + currency switcher,
   persist in a cookie, thread `@inContext(country/language)` through
   product/collection/cart/search, add `hreflang`/canonical/localized sitemap.
   Decide path (`/fr/...`) vs cookie **before** coding.
4. **Automatic discounts & promo banner** — read
   `cart.lines[].discountAllocations` (typed allocation) for auto-applied savings
   and drive a banner from a metaobject. Complements existing code entry.
5. **Reviews** — pick provider (app vs metaobject-backed), render aggregate
   rating + `AggregateRating`/`Review` JSON-LD, gate on consent/privacy update.

### P2 — Conversion and retention (needs scoping)

6. **Subscriptions / pre-orders** — `sellingPlanGroups` + variant plan selector,
   `cartLinesAdd.sellingPlanId`, manage-subscription link to the app portal.
7. **Bundles / shop-the-look** — `ProductVariant.components` / `requiresComponents`,
   add parent + child lines with `CartLineInput.parent`.
8. **Pickup + delivery estimate** — `cartDeliveryAddresses*` +
   `cart.deliveryGroups.deliveryOptions` + `cartSelectedDeliveryOptionsUpdate`
   (+ `pickupHandle`), **replacing** the deprecated buyer-identity address.
9. **Loyalty / referral** — read/write customer metafields via the existing
   `getCustomer(metafields:)` + Admin `MetafieldsSet`; provider vs custom, then
   surface points on the account page.
10. **Email lifecycle** — welcome, abandoned cart, post-purchase; depends on 0.1.
11. **Product media gallery** — video/3D from `Product.media`.
12. **Cart metafields** — structured gift/personalization (`cartMetafieldsSet`).

### P3 — Bets (validate demand first)

13. **Multipass SSO** — **Plus-only**; adds secret handling + "Ask first" review.
14. **Self-serve returns / exchanges / store credit** — Admin API or provider.
15. **AI search / sizing, visual search, PWA / offline cart draft**.
16. **B2B** (`CartBuyerIdentity.purchasingCompany`) — only if the store sells B2B.

## 6. Recommended build order

| Sprint | Items                                   | Why                                                     |
| ------ | --------------------------------------- | ------------------------------------------------------- |
| 1      | P0 0.1–0.3                              | Measurement + instant content ops + smaller API surface |
| 2      | P1 #1–#2 (blog, metaobject sections)    | Content-led SEO + merchandiser autonomy                 |
| 3–4    | P1 #3 (markets/i18n incl. SEO plumbing) | International revenue                                   |
| 5      | P1 #4–#5 (auto-discount promo, reviews) | Conversion + social proof                               |
| 6+     | P2 #6–#12                               | Differentiators                                         |
| Later  | P3 #13–#16                              | Bets                                                    |

Every item: colocated `*.test.ts` for actions/services/lib/shopify helpers,
focused `yarn vitest run <path>` → `yarn test:coverage`, then `yarn lint`,
`yarn format:check`, `yarn typegen && yarn lint-ts` (`AGENTS.md` Definition of
Done). Security-critical changes (webhook route, rate limit, token handling)
require new tests.

## 7. Metrics to attach per feature

- **Measurement (P0):** funnel step completion, add-to-cart rate, checkout start
  rate, purchase conversion, attribution coverage.
- **Content (blog/pages/metaobjects):** publish-to-live latency, publishing lead
  time, organic sessions, assisted conversions.
- **Markets:** intl conversion vs domestic, FX/bounce delta, alternate-URL
  indexation.
- **Search:** zero-result rate, CTR on suggestions, search-to-cart rate.
- **Reviews:** review coverage, PDP conversion delta.
- **Retention:** repeat-purchase rate, recently-viewed → cart rate, wishlist
  merge success rate.
- **Performance:** LCP/INP/CLS budget on PDP/PLP/home.

## 8. Open questions for the owner

1. **Markets:** which countries/currencies first, and path- vs cookie-based locale?
2. **Webhooks:** is Admin API access with `write_webhooks` (or a public app)
   available for P0 0.2?
3. **Reviews provider**, or metaobject-backed custom? Is the privacy copy ready?
4. **Email provider** (Shopify Email / Klaviyo / other) and consent wording?
5. **Subscriptions:** real demand or skip? Which app provides the customer portal?
6. **Plan tier:** is the store on Shopify Plus (decides whether Multipass stays)?
7. **Returns:** self-serve in-store, Admin API, or provider-hosted?
8. **Analytics:** GA4 property/GTM container owner for P0 0.1, and who signs off
   on consent-mode defaults?

## 9. Guardrails (from `AGENTS.md`)

- Admin usage stays server-only; no new scopes without review ("Ask first").
- Sanitize any store-authored HTML before `dangerouslySetInnerHTML`.
- No `any`, no dead code — the P0 0.3 deletions are part of this.
- New routes must be added to `config.routes` (typed routes) and the sitemap
  allow-list / robots as appropriate.
- Cookies written only in `proxy.ts` / route handlers / server actions.
- Do not lower test coverage thresholds to ship a feature.
