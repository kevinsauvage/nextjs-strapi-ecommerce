#!/usr/bin/env node
/**
 * Enumerate the Hertwill pet catalog into a reviewable manifest.
 *
 * The manifest is the single input for `bin/hertwill-import.mjs` and
 * `bin/shopify-curate-pets.mjs`, so the same catalog can be re-imported into
 * the production shop later (swap the store-scoped HERTWILL_API_KEY).
 *
 * Usage:
 *   node bin/hertwill-catalog.mjs sync  [--category "Pet Supplies"] [--shipping EU] [--manifest content/hertwill-pet-catalog.json]
 *   node bin/hertwill-catalog.mjs stats [--manifest content/hertwill-pet-catalog.json]
 *
 * Only EU-shippable products are kept (the shop sells to Spain + France).
 */
import { classify, hertwillRequest, parseArgs, readJson, writeJson } from './hertwill-shared.mjs';

const PER_PAGE = 100;
const CONCURRENCY = 6;

const mapLimit = async (items, limit, worker) => {
  const results = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });

  await Promise.all(runners);

  return results;
};

const fetchCatalog = async (category, shipping) => {
  const pages = [];
  let page = 1;
  let total = 1;

  while (pages.length < total) {
    const { body, status } = await hertwillRequest(
      `/v1/products?category=${encodeURIComponent(category)}&per_page=${PER_PAGE}&page=${page}`,
    );

    if (status !== 200) {
      throw new Error(`Catalog page ${page} failed: HTTP ${status} ${JSON.stringify(body)}`);
    }

    pages.push(...(body.data ?? []));
    total = body.meta?.pagination?.total ?? 0;
    page += 1;
  }

  console.info(`Fetched ${pages.length} products from "${category}".`);

  return pages;
};

const toVariation = (variation) => ({
  attributes: (variation.attributes ?? []).map((attribute) => ({
    name: attribute.name,
    value: attribute.value,
  })),
  id: variation.id,
  price: variation.price,
  sku: variation.sku,
  stock: variation.stock,
  stockStatus: variation.stock_status,
});

const syncCatalog = async (options) => {
  const category = options.category ?? 'Pet Supplies';
  const shipping = options.shipping ?? 'EU';
  const manifestPath = options.manifest ?? 'content/hertwill-pet-catalog.json';

  const products = await fetchCatalog(category, shipping);
  let done = 0;

  const detailed = await mapLimit(products, CONCURRENCY, async (product) => {
    const { body, status } = await hertwillRequest(`/v1/products/${product.id}`);

    done += 1;

    if (done % 25 === 0 || done === products.length) {
      console.info(`  details ${done}/${products.length}`);
    }

    if (status !== 200) {
      throw new Error(`Detail ${product.id} failed: HTTP ${status}`);
    }

    const detail = body.data ?? body;
    const { bucket, petType } = classify(detail.name ?? product.name);

    return {
      brand: detail.brand?.name ?? null,
      brandSlug: detail.brand?.slug ?? null,
      bucket,
      categories: (detail.categories ?? []).map((entry) => entry.slug),
      collections: (detail.collections ?? []).map((entry) => entry.slug),
      id: detail.id,
      image: detail.images?.featured ?? null,
      name: detail.name,
      petType,
      shippingRegions: (detail.shipping_regions ?? []).map((region) => region.code),
      sku: detail.sku,
      slug: detail.slug,
      stock: detail.stock,
      stockStatus: detail.stock_status,
      variations: (detail.variations ?? []).map(toVariation),
      wholesale: detail.price,
    };
  });

  const eligible = detailed.filter((product) => product.shippingRegions.includes(shipping));

  console.info(`Kept ${eligible.length}/${detailed.length} shipping to ${shipping}.`);

  eligible.sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    count: eligible.length,
    currency: 'EUR',
    generatedAt: new Date().toISOString(),
    products: eligible,
    source: { category, shipping },
  };

  writeJson(manifestPath, manifest);
  console.info(`Wrote ${eligible.length} products to ${manifestPath}.`);
};

const stats = (options) => {
  const manifest = readJson(options.manifest ?? 'content/hertwill-pet-catalog.json');
  const { products } = manifest;

  const tally = (key) =>
    Object.entries(
      products.reduce((accumulator, product) => {
        const value = product[key] ?? 'unknown';
        accumulator[value] = (accumulator[value] ?? 0) + 1;
        return accumulator;
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => `${value}:${count}`)
      .join('  ');

  const prices = products.map((product) => product.wholesale).sort((a, b) => a - b);

  console.info(`products      ${products.length}`);
  console.info(`brands        ${tally('brand')}`);
  console.info(`buckets       ${tally('bucket')}`);
  console.info(`petTypes      ${tally('petType')}`);
  console.info(`in stock      ${products.filter((p) => p.stockStatus === 'instock').length}`);
  console.info(
    `wholesale EUR ${prices[0]} .. ${prices.at(-1)} (median ${prices[Math.floor(prices.length / 2)]})`,
  );
  console.info(`with variants ${products.filter((p) => p.variations.length > 0).length}`);
};

const [command = 'sync', ...rest] = process.argv.slice(2);
const options = parseArgs(rest);

try {
  if (command === 'sync') {
    await syncCatalog(options);
  } else if (command === 'stats') {
    stats(options);
  } else {
    console.error('Usage: hertwill-catalog.mjs <sync|stats> [options]');
    process.exit(2);
  }
} catch (error) {
  console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
