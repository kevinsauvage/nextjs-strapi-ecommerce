# Shopify Content & Data Contract

> **Your storefront ships finished. Shopify makes it yours.**
>
> This is a headless storefront: the design, performance and checkout are built
> and maintained for you. Everything a shopper _reads and buys_ — the catalog,
> menus, policies, hero, FAQ — lives in **your** Shopify admin and can be changed
> in minutes, with no developer and no redeploy.
>
> This document is the contract between the storefront and your Shopify store:
> **what we need from Shopify to launch**, and **what you can override yourself**
> once you're live.

---

## 0. The 60-second version

| Question                             | Short answer                                                                                       |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| What is the source of truth?         | Shopify — for all commerce and all editorial content.                                              |
| What do I need to give you?          | Storefront + Admin API credentials, a populated catalog, menus, pages and policies (§2).           |
| What can I edit without a developer? | Hero, promo bar, size chart, FAQ, popular searches, menus, pages, policies (§3).                   |
| What happens if I change nothing?    | The site still looks complete — every section falls back to polished built-in content (§4).        |
| How fast do my edits go live?        | Instantly in Shopify; **up to 10 minutes** on the storefront because public reads are cached (§5). |
| What is _not_ driven by Shopify?     | Brand name, logo, social links, and some homepage copy — those are config (§7).                    |

---

## 1. Why this is the model you want

Most storefronts are a theme you fight. This one is different:

- **You own the content.** A merchandiser publishes a hero, a promo bar, an FAQ
  and a size chart from Shopify Admin → Content → Metaobjects — no ticket, no
  deploy, no "waiting on the dev".
- **You cannot break the layout.** Curated content only swaps _copy, links and
  images_ into a fixed, accessible, mobile-first design. There is no theme
  editor to misconfigure and no CSS to paste.
- **Nothing is ever empty.** Every override is a _fallback_, not a _replacement_.
  Before you curate anything, the storefront renders a finished, on-brand default.
- **It fails soft, silently.** If a metaobject is missing, unreadable, or has the
  wrong image host, the storefront serves the default instead of an error.
- **It's safe by construction.** All merchant HTML is sanitized on the server
  before it is rendered.

In short: you get the speed and control of a custom storefront, with the "press
publish and it appears" workflow of a hosted theme.

---

## 2. What we need from Shopify to launch

### 2.1 Credentials

| Variable                             | Where                                                          | Required     |
| ------------------------------------ | -------------------------------------------------------------- | ------------ |
| `SHOPIFY_STORE_FRONT_ACCESS_TOKEN`   | Custom app → Storefront API token                              | **Yes**      |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL` | `https://<store>.myshopify.com/api/2026-07/graphql.json`       | **Yes**      |
| `SHOPIFY_STORE_FRONT_ADMIN_TOKEN`    | Custom app → Admin API token                                   | For CMS sync |
| `SHOPIFY_ADMIN_URL`                  | `https://<store>.myshopify.com/admin/api/2026-07/graphql.json` | For CMS sync |

Set them in `.env.local` (never committed) and mirror the keys — without values
— in `.env.example`. The `bin/shopify-*.mjs` helper scripts read these to push
content from the repo into Shopify.

### 2.2 Catalog — products, variants & inventory

Each product should have, at minimum:

- **Title**, **handle**, **description / description HTML** (rich text is welcome).
- **Featured image + gallery** (`images`, up to 20 are read).
- **Price range** and **available-for-sale** state.
- **Options & variants** (size, colour, …) with a price and inventory per variant.
- Optional but recommended: **product type**, **tags**, **vendor**, **SEO title/description**.

> Inventory is respected: sold-out variants render a "Sold Out" state, so keep
> `inventory_quantity` accurate (or switch to continue-selling if made to order).

### 2.3 Collections — and the "Featured" flag

Collections power `/collections` and the filters. The homepage's
**"Explore our collections"** grid is opt-in:

> Add a **`custom.featured`** metafield to every collection you want on the
> homepage. Presence is what counts (a boolean `true` is the natural choice);
> collections without it stay out of the grid.

### 2.4 Images — a hard rule

Images must be served from an **absolute `https:` URL** on one of:

- `cdn.shopify.com` (Shopify-hosted product/content images), or
- `res.cloudinary.com`.

The storefront's `next/image` config and Content-Security-Policy only trust
those two hosts. An image from anywhere else is **dropped** (the built-in
artwork is used instead) rather than rendered broken. Practical rule: **upload
images to Shopify Files**, then use the generated `cdn.shopify.com` URL.

### 2.5 Navigation menus

Two Shopify menus drive the header and footer, read live by handle:

| Handle      | Renders in | Notes                                                                     |
| ----------- | ---------- | ------------------------------------------------------------------------- |
| `main-menu` | Header     | Up to 3 levels. Layout adapts: flat link → compact dropdown → mega panel. |
| `footer`    | Footer     | Grouped columns; leaves become the link list.                             |

Menus not named above (e.g. a customer-account menu) are never touched by our
sync scripts, so you can keep your own.

### 2.6 Pages

Marketing pages render at `/pages/<handle>` from Shopify Admin → Content → Pages.
Ship with these at launch:

| Handle       | Suggested content              |
| ------------ | ------------------------------ |
| `about-us`   | Brand story                    |
| `size-guide` | Sizing tables / how to measure |
| `faq`        | Full FAQ (long form)           |

Add as many more as you like — the route is fully dynamic. Internal links inside
page HTML should use storefront paths (`/contact`, `/pages/size-guide`).

### 2.7 Policies

These are read from your Shopify **Settings → Policies** and rendered on the
matching legal routes. Empty policies fall back to a friendly "contact us"
state — so please publish them before launch.

| Shopify policy      | Route           |
| ------------------- | --------------- |
| Privacy policy      | `/privacy`      |
| Refund policy       | `/refund`       |
| Shipping policy     | `/shipping`     |
| Terms of service    | `/terms`        |
| Subscription policy | `/subscription` |

### 2.8 Customer accounts

Login, registration, password recovery, order history and saved addresses run
through Shopify customer accounts and the Storefront API. For the optional
wishlist, the app stores a `custom.wishlist` metafield on the customer — create
the definition in Admin and expose it to the Storefront API. Newsletter signup
creates a Shopify customer, so the subscriber list stays in your store.

---

## 3. What you can override — without a developer

All editorial overrides live in **Shopify Admin → Content → Metaobjects** under
definitions this project creates for you. Run the seed scripts once (they are
idempotent and safe to re-run):

```sh
yarn sections:ensure   # create the five section definitions if missing
yarn sections:seed     # push everything in content/sections.json
yarn metaobjects:ensure
yarn metaobjects:seed  # popular-search chips
yarn content:seed      # Shopify Pages from content/pages.json
yarn navigation:sync    # main-menu + footer from content/navigation.json
```

> Prefer the UI? Everything below is also editable by hand in Admin. The scripts
> exist so content can be versioned in the repo and pushed in one command.

### 3.1 Homepage hero

**Type `hero_section` · Handle `home-hero`**

Replaces the homepage's headline block — copy, CTAs and image — while the layout
and animation stay identical.

| Field key         | What it does                                    | Required |
| ----------------- | ----------------------------------------------- | -------- |
| `heading`         | Big headline                                    | **Yes**  |
| `eyebrow`         | Small kicker above the headline                 | No       |
| `subheading`      | Supporting paragraph                            | No       |
| `image`           | Hero image URL (`cdn.shopify.com` / Cloudinary) | No       |
| `image_alt`       | Alt text for the hero image                     | No       |
| `primary_label`   | Primary button text                             | No       |
| `primary_url`     | Primary button link (path or absolute URL)      | No       |
| `secondary_label` | Secondary button text                           | No       |
| `secondary_url`   | Secondary button link                           | No       |

- If `heading` is empty, the built-in hero is used.
- No custom image? The hero automatically uses your **featured collection's**
  image, with a "Featured collection" overlay.
- Friendly aliases are accepted (`title`, `kicker`, `image_url`, `cta_label`,
  `cta_url`, …), so a hand-made definition still works.

### 3.2 Header promo bar

**Type `promo_bar` · Handle `promo-bar`**

The announcement bar above the header. Replaces the built-in shipping message.

| Field key    | What it does                          | Required |
| ------------ | ------------------------------------- | -------- |
| `text`       | Announcement copy                     | **Yes**  |
| `link_label` | Optional link text (e.g. "Shop sale") | No       |
| `link_url`   | Where the link points                 | No       |
| `tone`       | `ink` (default), `gold`, or `neutral` | No       |
| `active`     | `false` hides the bar entirely        | No       |

### 3.3 Product-page size chart

**Type `size_chart` · Handle `size-chart`**

Renders inside the product description accordion.

| Field key | What it does                               | Required |
| --------- | ------------------------------------------ | -------- |
| `body`    | HTML: a table, list or paragraphs          | **Yes**  |
| `title`   | Accordion title (defaults to "Size chart") | No       |
| `note`    | Footnote under the chart                   | No       |

### 3.4 Homepage FAQ

Two metaobjects: one heading, then one entry per question.

**Type `faq_section` · Handle `home-faq`**

| Field key | What it does                      | Required |
| --------- | --------------------------------- | -------- |
| `title`   | Section heading                   | No       |
| `intro`   | Short paragraph under the heading | No       |

**Type `faq_item` — one metaobject per question**

| Field key  | What it does                              | Required |
| ---------- | ----------------------------------------- | -------- |
| `question` | The accordion question                    | **Yes**  |
| `answer`   | Answer HTML (links, bold, lists all work) | No       |
| `position` | Sort order — lowest first                 | No       |

- Up to **12** FAQ items render (a guardrail against page bloat).
- The section only appears when at least one heading **or** item is curated.
- Prefer a full standalone FAQ page? Use the `faq` Shopify Page (`/pages/faq`)
  and this homepage accordion for the top questions.

### 3.5 Popular-search chips

**Type `popular_search_term`** — drives the "Popular:" chips on `/search`.

| Field key | What it does              | Required |
| --------- | ------------------------- | -------- |
| `term`    | The suggested search term | **Yes**  |

- Up to **8** chips; duplicates are removed.
- Aliases `query`, `label`, `title` are accepted.
- Nothing curated? A curated default list is shown instead.

### 3.6 Quick reference — every override at a glance

| Surface              | Shopify object       | Handle / key                 | Falls back to            |
| -------------------- | -------------------- | ---------------------------- | ------------------------ |
| Homepage hero        | metaobject           | `hero_section` / `home-hero` | Built-in editorial hero  |
| Header promo bar     | metaobject           | `promo_bar` / `promo-bar`    | Built-in shipping line   |
| PDP size chart       | metaobject           | `size_chart` / `size-chart`  | Hidden / default chart   |
| FAQ heading          | metaobject           | `faq_section` / `home-faq`   | Hidden section           |
| FAQ entries          | metaobject (list)    | `faq_item`                   | Hidden section           |
| Popular searches     | metaobject (list)    | `popular_search_term`        | Static default chips     |
| Header / footer nav  | menus                | `main-menu`, `footer`        | Empty nav (curate these) |
| Marketing pages      | pages                | `/pages/<handle>`            | 404 until published      |
| Legal policies       | shop policies        | privacy/refund/…             | "Policy unavailable"     |
| Homepage collections | collection metafield | `custom.featured`            | Section hidden           |

---

## 4. What ships if you do nothing

This is the safety net — and one of the reasons you can launch fast:

- **Hero** → a finished editorial headline, sub-headline, dual CTAs and imagery.
- **Promo bar** → "Complimentary shipping on orders over $150 · Easy 30-day returns".
- **FAQ** → the section simply doesn't render until you add content (no empty box).
- **Size chart** → the accordion entry appears only when a chart exists.
- **Popular searches** → a sensible default list of terms.
- **Legal pages** → a friendly "Policy unavailable — contact us" card.

Nothing looks half-built, regardless of how much you've curated.

---

## 5. How publishing works

1. **Edit** the metaobject / menu / page / policy in Shopify Admin.
2. **Publish** (metaobjects and pages have a draft/published state — make sure
   it's live).
3. **Storefront reads it** on the next request, through the Storefront API.

**The one thing to know:** public Shopify reads are cached for **10 minutes**
(`revalidate.shopify = 600`, tag `shopify`). After publishing, allow up to ten
minutes before the change is visible on the storefront. A signed, on-demand
cache-purge webhook is on the roadmap — with it, publish-to-live drops to
seconds.

If you prefer to manage everything from the repo, the scripts push in one
direction only. Edits made in Admin do **not** flow back automatically — run
`content:pull` first if you want to capture them before the next seed.

---

## 6. Guardrails & gotchas

- **Images**: absolute `https:` on `cdn.shopify.com` or `res.cloudinary.com`
  only, or they're ignored.
- **HTML**: `body` / `answer` fields are sanitized server-side before rendering.
  Scripts, event handlers and unknown tags are stripped — paste clean HTML.
- **FAQ**: maximum 12 items rendered.
- **Popular searches**: maximum 8 chips.
- **Handles**: metaobject handles are fixed (`home-hero`, `promo-bar`,
  `size-chart`, `home-faq`). Changing the _fields_ is fine; changing the handle
  means the storefront won't find it.
- **One of each**: only one hero and one promo bar are read (by handle), and
  only the featured collection grid reads `custom.featured`.
- **Fields are additive**: `ensure` never rewrites an existing definition's
  fields, so adding a new field is an Admin change (or a script update) before
  seeding.

---

## 7. What is _not_ driven by Shopify

To avoid surprises, these are configured in the repo / environment, not Admin:

| Thing                                                   | Where                                                 |
| ------------------------------------------------------- | ----------------------------------------------------- |
| Brand name, email, phone, logo, social links            | `NEXT_PUBLIC_SITE_*` env / `src/data/siteMetadata.ts` |
| Static SEO titles/descriptions                          | `src/data/seo.ts`                                     |
| Homepage perks, testimonials, rating stats, closing CTA | `src/app/page.tsx` (currently hardcoded)              |
| Footer trust badges                                     | `src/components/Footer.tsx`                           |

The homepage perks/testimonials are candidates for a future "testimonials"
metaobject so you can edit them too — ask if you'd like that added.

---

## 8. Launch checklist

**Credentials & config**

- [ ] Storefront API token + endpoint set (`SHOPIFY_STORE_FRONT_ACCESS_TOKEN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL`).
- [ ] Admin API token + endpoint set (for CMS sync).
- [ ] `NEXT_PUBLIC_BASE_URL` points at the production domain.
- [ ] `NEXT_PUBLIC_SITE_*` values set (name, logo, email, phone, socials).

**Commerce**

- [ ] Products complete: images, variants, prices, inventory, SEO.
- [ ] Collections created and organised.
- [ ] `custom.featured` set on collections for the homepage grid.

**Content**

- [ ] `main-menu` and `footer` menus built.
- [ ] Pages `about-us`, `size-guide`, `faq` published.
- [ ] Policies (privacy, refund, shipping, terms, subscription) published.
- [ ] Hero, promo bar, size chart and FAQ curated (or intentionally left default).
- [ ] Popular-search terms curated.

**Verify**

- [ ] Run `yarn sections:list` / `yarn metaobjects:list` / `yarn navigation:list` to confirm.
- [ ] Seed and re-check the storefront after the 10-minute cache window.

---

## 9. Where to go next

- **README.md** — engineering setup, scripts and architecture.
- **GROWTH_PLAN.md** — the prioritized roadmap (measurement, blog, markets,
  reviews, webhook cache-purge, and more).
- **AGENTS.md** — contribution rules and conventions.

Want a section that isn't listed here yet (testimonials, banner carousel,
per-collection copy blocks)? Most are a new metaobject plus a storefront reader
— tell us what you'd like to edit, and it becomes another no-deploy lever.
