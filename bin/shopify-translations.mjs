#!/usr/bin/env node
/**
 * Publish Spanish and French translations of the Shopify content we own.
 *
 * Flow:
 *   1. enable + publish the `es` / `fr` shop locales;
 *   2. resolve resource ids (collections, pages, menu items, metaobjects, products);
 *   3. push every translation found in `content/translations/<locale>.json`.
 *
 * The manifest is keyed by stable handles (not ids) so it stays reviewable and
 * portable between the test and production stores. Anything missing from a
 * manifest is simply left to fall back to the primary (English) content.
 *
 * Usage:
 *   node bin/shopify-translations.mjs status
 *   node bin/shopify-translations.mjs locales  --confirm
 *   node bin/shopify-translations.mjs apply    [--locale es] [--confirm]
 */
import { createHash } from 'node:crypto';

import { adminRequest, parseArgs, readJson, throwOnUserErrors } from './hertwill-shared.mjs';

const LOCALES = ['es', 'fr'];
const MANIFEST_DIR = 'content/translations';

const readManifest = (locale) => {
  try {
    return readJson(`${MANIFEST_DIR}/${locale}.json`);
  } catch {
    return {};
  }
};

const listShopLocales = async () => {
  const { data } = await adminRequest(`{ shopLocales{ locale name published primary } }`);
  return data.shopLocales;
};

const listCollections = async () => {
  const { data } = await adminRequest(
    `{ collections(first:100){ edges{ node{ id handle title descriptionHtml } } } }`,
  );
  return data.collections.edges.map((edge) => edge.node);
};

const listPages = async () => {
  const { data } = await adminRequest(
    `{ pages(first:100){ edges{ node{ id handle title body } } } }`,
  );
  return data.pages.edges.map((edge) => edge.node);
};

const listMenuItems = async () => {
  const { data } = await adminRequest(
    `{ menus(first:10){ edges{ node{ handle items { id title items { id title items { id title } } } } } } }`,
  );

  const rows = [];
  for (const menu of data.menus.edges.map((edge) => edge.node)) {
    const walk = (items, parents) => {
      for (const item of items) {
        const path = [...parents, item.title];
        rows.push({
          // A menu item is translatable as a `LINK` resource under the same
          // numeric id: `gid://shopify/MenuItem/<n>` -> `gid://shopify/Link/<n>`.
          // The MenuItem GID itself is rejected by `translatableResource`, and
          // `resourceId` is null for every HTTP link, so neither can be used.
          handle: path.join(' > '),
          id: item.id ? item.id.replace('/MenuItem/', '/Link/') : null,
          menu: menu.handle,
          title: item.title,
        });
        if (item.items?.length) walk(item.items, path);
      }
    };
    walk(menu.items, [menu.handle]);
  }
  return rows;
};

const listMetaobjects = async () => {
  const types = [
    'hero_section',
    'promo_bar',
    'faq_section',
    'faq_item',
    'size_chart',
    'popular_search_term',
  ];

  const rows = [];
  for (const type of types) {
    const { data } = await adminRequest(
      `query($type: String!){ metaobjects(type:$type, first:100){ edges{ node{ id handle type } } } }`,
      { type },
    );
    for (const edge of data.metaobjects.edges.map((e) => e.node)) {
      rows.push({ handle: `${type}:${edge.handle}`, id: edge.id, type: edge.type });
    }
  }
  return rows;
};

const listProducts = async () => {
  const rows = [];
  let cursor = null;
  let hasNext = true;

  while (hasNext) {
    const { data } = await adminRequest(
      `query($cursor: String){ products(first:100, after:$cursor){ pageInfo{ hasNextPage endCursor } edges{ node{ id handle title descriptionHtml } } } }`,
      { cursor },
    );
    for (const edge of data.products.edges.map((e) => e.node)) {
      rows.push({
        handle: edge.handle,
        id: edge.id,
        title: edge.title,
        descriptionHtml: edge.descriptionHtml,
      });
    }
    hasNext = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }
  return rows;
};

/**
 * Digest of the current translatable content. Shopify compares it to the value
 * stored in the target locale and rejects the write if the content changed
 * underneath us. It must be a hex-encoded SHA-256 (base64 is rejected).
 */
const digest = (value) =>
  createHash('sha256')
    .update(String(value ?? ''))
    .digest('hex');

const listWebPresenceIds = async () => {
  const { data } = await adminRequest(`{ webPresences(first:20){ edges{ node{ id } } } }`);
  return data.webPresences.edges.map((edge) => edge.node.id);
};

const ensureLocales = async (options) => {
  const [existing, webPresenceIds] = await Promise.all([listShopLocales(), listWebPresenceIds()]);
  const missing = LOCALES.filter((locale) => !existing.some((entry) => entry.locale === locale));

  for (const locale of missing) {
    console.info(`${options.confirm ? 'enabling' : 'would enable'} ${locale}`);
    if (!options.confirm) continue;

    const enabled = await adminRequest(
      `mutation($locale: String!){ shopLocaleEnable(locale:$locale){ shopLocale{ locale name published } userErrors{ field message } } }`,
      { locale },
    );
    throwOnUserErrors(enabled.data.shopLocaleEnable, `shopLocaleEnable ${locale}`);
  }

  // A published shop locale is not enough: it must also be enabled on the market
  // web presences, otherwise the Storefront API keeps returning the default
  // language for `@inContext(language:)` (menus, collections, products, pages).
  for (const locale of LOCALES) {
    console.info(
      `${options.confirm ? 'enabling' : 'would enable'} ${locale} on ${webPresenceIds.length} web presence(s)`,
    );
    if (!options.confirm) continue;

    const updated = await adminRequest(
      `mutation($locale: String!, $shopLocale: ShopLocaleInput!){ shopLocaleUpdate(locale:$locale, shopLocale:$shopLocale){ shopLocale{ locale published } userErrors{ field message } } }`,
      { locale, shopLocale: { marketWebPresenceIds: webPresenceIds, published: true } },
    );
    throwOnUserErrors(updated.data.shopLocaleUpdate, `shopLocaleUpdate ${locale}`);
  }
};

/**
 * Current values of every metaobject we own, read from `content/` (the same
 * files `bin/shopify-sections.mjs` seeds from) so the digest we send matches
 * what is stored in the shop.
 */
const metaobjectFieldValues = () => {
  const sections = readJson('content/sections.json');
  const popular = readJson('content/popular-searches.json');
  const values = new Map();

  const hero = sections.hero ?? {};
  values.set(`hero_section:${hero.handle || 'home-hero'}`, {
    eyebrow: hero.eyebrow,
    heading: hero.heading,
    subheading: hero.subheading,
    image: hero.image,
    image_alt: hero.imageAlt,
    primary_label: hero.primaryLabel,
    primary_url: hero.primaryUrl,
    secondary_label: hero.secondaryLabel,
    secondary_url: hero.secondaryUrl,
  });

  const promo = sections.promoBar ?? {};
  values.set(`promo_bar:${promo.handle || 'promo-bar'}`, {
    active: promo.active === false ? 'false' : 'true',
    link_label: promo.linkLabel,
    link_url: promo.linkUrl,
    text: promo.text,
    tone: promo.tone,
  });

  const chart = sections.sizeChart ?? {};
  values.set(`size_chart:${chart.handle || 'size-chart'}`, {
    body: chart.body,
    note: chart.note,
    title: chart.title,
  });

  const faq = sections.faq ?? {};
  values.set(`faq_section:${faq.handle || 'home-faq'}`, { intro: faq.intro, title: faq.title });
  for (const [index, item] of (faq.items ?? []).entries()) {
    const handle = `faq-${index + 1}-${slugify(item.question).slice(0, 40)}`;
    values.set(`faq_item:${handle}`, {
      answer: item.answer,
      position: String(index + 1),
      question: item.question,
    });
  }

  for (const term of popular.terms ?? []) {
    values.set(`popular_search_term:${slugify(term)}`, { term });
  }

  return values;
};

const slugify = (value) =>
  String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Localized metaobject writes.
 *
 * Metaobject fields are not addressable through `translationsRegister` (Shopify
 * rejects every key except the resource `value`), but `metaobjectUpsert`
 * accepts a `values` map shaped `{ field: { locale: value } }`. The map replaces
 * the field wholesale, so the default language is injected from `content/`
 * (the same source the seed scripts write) and merged with the translations.
 */
const localizeMetaobjects = async (manifests, currentFields, options) => {
  const localeKeys = Object.keys(manifests);
  if (localeKeys.length === 0) return 0;

  const byResource = new Map();

  for (const locale of localeKeys) {
    for (const [handle, entry] of Object.entries(manifests[locale].metaobjects ?? {})) {
      if (typeof entry !== 'object' || entry === null) continue;

      const resource = byResource.get(handle) ?? { fields: {} };
      for (const [field, value] of Object.entries(entry)) {
        if (typeof value !== 'string' || !value.trim()) continue;
        resource.fields[field] = { ...(resource.fields[field] ?? {}), [locale]: value };
      }
      byResource.set(handle, resource);
    }
  }

  let applied = 0;
  for (const [handle, { fields }] of byResource) {
    const [type, metaobjectHandle] = handle.split(':');
    if (!type || !metaobjectHandle) continue;

    // `values` REPLACES the field, and the storefront picks the entry for the
    // request locale — so the default language must be sent in the same map or
    // the English content would be lost.
    const defaults = currentFields.get(handle) ?? {};
    const values = {};
    for (const [field, translations] of Object.entries(fields)) {
      const primary = String(defaults[field] ?? '').trim();
      values[field] = primary ? { en: primary, ...translations } : translations;
    }

    if (!options.confirm) {
      console.info(
        `  [dry-run] metaobject ${handle}: ${Object.keys(values).length} field(s) x ${localeKeys.length + 1} locale(s)`,
      );
      continue;
    }

    const result = await adminRequest(
      `mutation($handle: MetaobjectHandleInput!, $values: JSON){
        metaobjectUpsert(handle:$handle, values:$values){
          metaobject{ id handle type }
          userErrors{ field message }
        }
      }`,
      { handle: { handle: metaobjectHandle, type }, values },
    );
    throwOnUserErrors(result.data.metaobjectUpsert, `metaobjectUpsert ${handle}`);
    applied += Object.keys(values).length;
    console.info(`  metaobject ${handle}: ${Object.keys(values).length} field(s)`);
  }

  return applied;
};

const applyTranslations = async (options) => {
  const locales = options.locale ? [options.locale] : LOCALES;

  const [collections, pages, menuItems, products] = await Promise.all([
    listCollections(),
    listPages(),
    listMenuItems(),
    listProducts(),
  ]);

  const manifests = Object.fromEntries(locales.map((locale) => [locale, readManifest(locale)]));
  const currentFields = metaobjectFieldValues();
  let applied = 0;
  let missingInStore = 0;
  const skipped = [];
  const unmanaged = [];

  // Metaobjects are written through their own per-locale `values` path.
  applied += await localizeMetaobjects(manifests, currentFields, options);

  const register = async (resourceId, entries, label) => {
    if (entries.length === 0) return;

    if (!options.confirm) {
      console.info(`  [dry-run] ${label}: ${entries.length} field(s)`);
      return;
    }

    // Fields are registered one at a time so an unsupported translatable key
    // (Shopify changes these per resource type) never blocks the rest of the
    // catalogue.
    for (const entry of entries) {
      try {
        const payload = entry;
        const result = await adminRequest(
          `mutation($resourceId: ID!, $translations: [TranslationInput!]!){ translationsRegister(resourceId:$resourceId, translations:$translations){ translations{ key locale value } userErrors{ field message } } }`,
          { resourceId, translations: [payload] },
        );
        throwOnUserErrors(result.data.translationsRegister, `translationsRegister ${label}`);
        applied += 1;
      } catch (error) {
        skipped.push(`${label}.${entry.key}: ${error instanceof Error ? error.message : error}`);
      }
    }

    console.info(`  ${label}: ${entries.length} field(s)`);
  };

  for (const locale of locales) {
    const manifest = manifests[locale] ?? {};
    console.info(`\n== ${locale} ==`);

    for (const collection of collections) {
      const entry = manifest.collections?.[collection.handle];
      if (!entry) continue;

      // Shopify exposes a collection body as `body_html` in the Translations
      // API, while the manifest keeps the friendlier `description`.
      const current = { body_html: collection.descriptionHtml, title: collection.title };
      const entries = Object.entries(entry)
        .map(([field, value]) => ({
          key: field === 'description' ? 'body_html' : field,
          value,
        }))
        .filter(({ key, value }) => key in current && typeof value === 'string' && value.trim())
        .map(({ key, value }) => ({
          locale,
          key,
          translatableContentDigest: digest(current[key]),
          value,
        }));

      await register(collection.id, entries, `collection ${collection.handle}`);
    }

    for (const page of pages) {
      const entry = manifest.pages?.[page.handle];
      if (!entry) continue;

      // Shopify exposes the page body as `body_html`; the manifest calls it
      // `body`, mirroring the HTML file it is authored from.
      const current = { body_html: page.body, title: page.title };
      const entries = Object.entries(entry)
        .map(([field, value]) => ({
          key: field === 'body' ? 'body_html' : field,
          value,
        }))
        .filter(({ key, value }) => key in current && typeof value === 'string' && value.trim())
        .map(({ key, value }) => ({
          locale,
          key,
          translatableContentDigest: digest(current[key]),
          value,
        }));

      await register(page.id, entries, `page ${page.handle}`);
    }

    for (const item of menuItems) {
      const title = manifest.menuItems?.[item.handle];
      if (!title) continue;

      // Safety net: an item without a GID cannot be registered through the API,
      // so report it instead of failing the run.
      if (!item.id) {
        unmanaged.push(`menu ${item.handle}`);
        continue;
      }

      await register(
        item.id,
        [{ locale, key: 'title', translatableContentDigest: digest(item.title), value: title }],
        `menu ${item.handle}`,
      );
    }

    for (const product of products) {
      const entry = manifest.products?.[product.handle];
      if (!entry) continue;

      // Product copy uses Shopify's `body_html` key; the manifest calls it
      // `description` (as collections do). A bare string is still accepted as
      // the title, for the older manifest shape.
      const fields = typeof entry === 'string' ? { title: entry } : entry;
      const current = { body_html: product.descriptionHtml, title: product.title };
      const entries = Object.entries(fields)
        .map(([field, value]) => ({
          key: field === 'description' ? 'body_html' : field,
          value,
        }))
        .filter(({ key, value }) => key in current && typeof value === 'string' && value.trim())
        .map(({ key, value }) => ({
          locale,
          key,
          translatableContentDigest: digest(current[key]),
          value,
        }));

      await register(product.id, entries, `product ${product.handle}`);
    }

    const known = new Set([
      ...collections.map((c) => c.handle),
      ...pages.map((p) => p.handle),
      ...menuItems.map((m) => m.handle),
      ...products.map((p) => p.handle),
    ]);
    const orphans = Object.keys({
      ...(manifest.collections ?? {}),
      ...(manifest.pages ?? {}),
      ...(manifest.products ?? {}),
    }).filter((handle) => !known.has(handle));

    if (orphans.length > 0) {
      missingInStore += orphans.length;
      console.info(`  not found in store: ${orphans.join(', ')}`);
    }
  }

  console.info(
    `\n${options.confirm ? 'Registered' : 'Would register'} ${applied} translation field(s).${
      missingInStore ? ` ${missingInStore} manifest key(s) not matched.` : ''
    }`,
  );

  if (unmanaged.length > 0) {
    console.info(
      `\n${unmanaged.length} menu label(s) must be translated in Shopify admin (Content -> Menus):`,
    );
    for (const line of unmanaged) console.info(`  - ${line}`);
  }

  if (skipped.length > 0) {
    console.info(`\nSkipped ${skipped.length} field(s):`);
    for (const line of skipped) console.info(`  - ${line}`);
  }
};

const status = async () => {
  for (const locale of await listShopLocales()) {
    console.info(
      `  ${locale.locale.padEnd(6)} ${locale.name.padEnd(10)} published=${locale.published}`,
    );
  }
};

/**
 * Removes existing translations for the resources in the manifests so they can
 * be re-registered against a market (`translationsRegister` refuses to move an
 * existing translation to a different market).
 */
const resetTranslations = async (options) => {
  const locales = options.locale ? [options.locale] : LOCALES;
  const [collections, pages, products] = await Promise.all([
    listCollections(),
    listPages(),
    listProducts(),
  ]);

  const targets = [
    ...collections
      .filter((collection) => LOCALES.some((l) => readManifest(l).collections?.[collection.handle]))
      .map((collection) => ({
        id: collection.id,
        keys: ['body_html', 'title'],
        label: collection.handle,
      })),
    ...pages
      .filter((page) => LOCALES.some((l) => readManifest(l).pages?.[page.handle]))
      .map((page) => ({ id: page.id, keys: ['body', 'title'], label: page.handle })),
    ...products
      .filter((product) => LOCALES.some((l) => readManifest(l).products?.[product.handle]))
      .map((product) => ({ id: product.id, keys: ['title'], label: product.handle })),
  ];

  console.info(`Clearing ${targets.length} resources for [${locales.join(', ')}]`);
  if (!options.confirm) return;

  for (const target of targets) {
    const result = await adminRequest(
      `mutation($resourceId: ID!, $translationKeys: [String!]!, $locales: [String!]!){ translationsRemove(resourceId:$resourceId, translationKeys:$translationKeys, locales:$locales){ translations{ key locale } userErrors{ field message } } }`,
      { resourceId: target.id, translationKeys: target.keys, locales },
    );
    throwOnUserErrors(result.data.translationsRemove, `translationsRemove ${target.label}`);
  }
  console.info(`Cleared ${targets.length} resources.`);
};

const [command = 'status', ...rest] = process.argv.slice(2);
const options = parseArgs(rest);

try {
  if (command === 'status') {
    await status();
  } else if (command === 'locales') {
    await ensureLocales(options);
  } else if (command === 'apply') {
    await applyTranslations(options);
  } else if (command === 'reset') {
    await resetTranslations(options);
  } else {
    console.error(
      'Usage: shopify-translations.mjs <status|locales|apply|reset> [--locale es] [--confirm]',
    );
    process.exit(2);
  }
} catch (error) {
  console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
