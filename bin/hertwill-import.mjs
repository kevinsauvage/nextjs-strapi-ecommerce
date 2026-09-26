#!/usr/bin/env node
/**
 * Import Hertwill products into the connected Shopify store.
 *
 * Two stages, matching the Hertwill API:
 *   add  -> POST /v1/import-list/products   (queue products, returns variation pairs)
 *   sync -> POST /v1/sync/products          (push one product with absolute prices)
 *
 * `run` does add + sync + poll. State (variation `dropship_id` pairs) is kept in
 * `content/hertwill-import-list.json` so re-runs are idempotent.
 *
 * Usage:
 *   node bin/hertwill-import.mjs status
 *   node bin/hertwill-import.mjs run  --ids 10193,10185
 *   node bin/hertwill-import.mjs run  --limit 5 --only-instock
 *   node bin/hertwill-import.mjs add  --all [--dry-run]
 *   node bin/hertwill-import.mjs sync --all [--dry-run]
 *
 * Prices come from content/hertwill-pricing.json (EUR wholesale x tier -> X.90).
 * The store's currency must match `pricing.currency` in Shopify.
 */
import {
  computePrice,
  hertwillRequest,
  loadPricing,
  parseArgs,
  readJson,
  sleep,
  writeJson,
} from './hertwill-shared.mjs';

const MANIFEST = 'content/hertwill-pet-catalog.json';
const IMPORT_LIST = 'content/hertwill-import-list.json';
const TERMINAL = new Set(['synced', 'sync-failed', 'rejected', 'approval-required', 'approved']);

const loadState = () => {
  try {
    return readJson(IMPORT_LIST);
  } catch {
    return { items: {} };
  }
};

const selectProducts = (manifest, options, state) => {
  let products = manifest.products;

  if (options.ids) {
    const wanted = new Set(
      String(options.ids)
        .split(',')
        .map((value) => Number(value.trim())),
    );
    products = products.filter((product) => wanted.has(product.id));
  } else {
    if (options.brand) {
      products = products.filter((product) => product.brandSlug === options.brand);
    }
    if (options.bucket) {
      products = products.filter((product) => product.bucket === options.bucket);
    }
    if (options['only-instock']) {
      products = products.filter((product) => product.stockStatus === 'instock');
    }
    if (options.limit) {
      const limit = Number(options.limit);
      products = products.filter((product) => !state.items?.[product.id]).slice(0, limit);
    }
  }

  if (!options.ids && options['skip-synced'] !== false && !options.limit) {
    products = products.filter((product) => !TERMINAL.has(state.items?.[product.id]?.status));
  }

  return products;
};

const addProducts = async (products, state, options) => {
  if (options['dry-run']) {
    console.info(`[dry-run] would add ${products.length} products to the import list.`);
    return;
  }

  for (let index = 0; index < products.length; index += 50) {
    const chunk = products.slice(index, index + 50);
    const { body, status } = await hertwillRequest('/v1/import-list/products', {
      body: { product_ids: chunk.map((product) => product.id) },
      method: 'POST',
    });

    if (status !== 201) {
      throw new Error(`import-list add failed: HTTP ${status} ${JSON.stringify(body)}`);
    }

    for (const item of body.data ?? []) {
      state.items[item.product_id] = {
        name: chunk.find((product) => product.id === item.product_id)?.name ?? null,
        parent_id: item.parent_id ?? state.items[item.product_id]?.parent_id ?? null,
        status: item.status,
        variations: item.variations ?? state.items[item.product_id]?.variations ?? [],
      };
    }

    const counts = (body.data ?? []).reduce((accumulator, item) => {
      accumulator[item.status] = (accumulator[item.status] ?? 0) + 1;
      return accumulator;
    }, {});
    console.info(`  added ${index + chunk.length}/${products.length}: ${JSON.stringify(counts)}`);
  }

  writeJson(IMPORT_LIST, state);
};

const buildPayload = (product, state, pricing) => {
  const item = state.items[product.id];
  const payload = {
    currency: pricing.currency,
    default_store_markup: computePrice(product.wholesale, pricing),
    lang: 'en',
    product_id: product.id,
  };

  if (item?.variations?.length) {
    payload.variations = item.variations.map((variation) => {
      const detail = product.variations.find((entry) => entry.id === variation.id);
      return {
        default_store_markup: computePrice(detail?.price ?? product.wholesale, pricing),
        dropship_id: variation.dropship_id,
        id: variation.id,
      };
    });
  }

  return payload;
};

const syncProducts = async (products, state, pricing, options) => {
  const pending = [];

  for (const product of products) {
    const payload = buildPayload(product, state, pricing);

    if (options['dry-run']) {
      console.info(
        `[dry-run] ${product.id} ${product.name} -> ${payload.default_store_markup} ${pricing.currency}`,
      );
      continue;
    }

    const { body, status } = await hertwillRequest('/v1/sync/products', {
      body: payload,
      method: 'POST',
    });

    if (status === 202) {
      console.info(`  sync queued ${product.id} (${payload.default_store_markup})`);
      state.items[product.id] = { ...state.items[product.id], status: 'syncing' };
      pending.push(product.id);
    } else {
      const message = body?.error?.message ?? JSON.stringify(body);
      console.info(`  sync refused ${product.id}: HTTP ${status} ${message}`);
      state.items[product.id] = {
        ...state.items[product.id],
        status: status === 403 ? 'approval-required' : 'refused',
      };
    }

    await sleep(250);
  }

  if (!options['dry-run']) writeJson(IMPORT_LIST, state);

  // Poll queued jobs until they settle.
  for (const id of pending) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const { body } = await hertwillRequest(`/v1/sync/jobs/${id}`);
      const status = body?.data?.status;
      if (TERMINAL.has(status)) {
        console.info(`  job ${id}: ${status}`);
        state.items[id] = { ...state.items[id], status };
        break;
      }
      await sleep(2000);
    }
    writeJson(IMPORT_LIST, state);
  }
};

const status = async () => {
  const { body } = await hertwillRequest('/v1/sync/jobs');
  const data = body?.data ?? [];
  console.info(`jobs: ${data.length}`);
  for (const job of data) {
    console.info(`  ${String(job.status).padEnd(18)} ${job.product_id}  ${job.name}`);
  }

  const health = await hertwillRequest('/v1/sync/health');
  console.info(`health: ${JSON.stringify(health.body?.data?.counts)}`);
};

const [command = 'status', ...rest] = process.argv.slice(2);
const options = parseArgs(rest);

try {
  const pricing = loadPricing();
  const manifest = readJson(options.manifest ?? MANIFEST);
  const state = loadState();

  if (command === 'status') {
    await status();
  } else if (command === 'add') {
    const products = selectProducts(manifest, options, state);
    console.info(`Adding ${products.length} products to the import list...`);
    await addProducts(products, state, options);
  } else if (command === 'sync') {
    const products = selectProducts(manifest, options, state);
    console.info(`Syncing ${products.length} products...`);
    await syncProducts(products, state, pricing, options);
  } else if (command === 'run') {
    const products = selectProducts(manifest, options, state);
    console.info(`Importing ${products.length} products...`);
    await addProducts(products, state, options);
    await syncProducts(products, state, pricing, options);
    await status();
  } else {
    console.error(
      'Usage: hertwill-import.mjs <run|add|sync|status> [--ids a,b] [--limit n] [--all] [--dry-run]',
    );
    process.exit(2);
  }
} catch (error) {
  console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
