#!/usr/bin/env node
/**
 * Wipe the previous (fashion) catalog from Shopify: products and collections.
 *
 * Guarded on purpose — nothing is deleted without `--confirm`. Products created
 * by the Hertwill import (tagged `bucket:*`) and the collection handles managed
 * by `bin/shopify-curate-pets.mjs` are always kept.
 *
 * Usage:
 *   node bin/shopify-reset-catalog.mjs count
 *   node bin/shopify-reset-catalog.mjs products    --confirm [--concurrency 4]
 *   node bin/shopify-reset-catalog.mjs collections --confirm
 *   node bin/shopify-reset-catalog.mjs all         --confirm
 */
import { adminRequest, parseArgs, sleep, throwOnUserErrors } from './hertwill-shared.mjs';

const KEEP_COLLECTIONS = new Set([
  'all-products',
  'dogs',
  'cats',
  'walk-travel',
  'home-comfort',
  'play-enrichment',
  'feeding',
  'care-grooming',
]);

const mapLimit = async (items, limit, worker) => {
  let cursor = 0;
  let done = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index]);
      done += 1;
      if (done % 100 === 0) console.info(`  deleted ${done}/${items.length}`);
    }
  });

  await Promise.all(runners);
};

const fetchAll = async (query, key, { pageSize = 250 } = {}) => {
  const nodes = [];
  let cursor = null;
  let hasNext = true;

  while (hasNext) {
    const { data } = await adminRequest(query, { cursor, first: pageSize });
    const connection = data[key];
    nodes.push(...connection.edges.map((edge) => edge.node));
    hasNext = connection.pageInfo.hasNextPage;
    cursor = connection.pageInfo.endCursor;
  }

  return nodes;
};

const count = async () => {
  const { data } = await adminRequest(`{ productsCount{ count } collectionsCount{ count } }`);
  console.info(
    `products: ${data.productsCount.count}  collections: ${data.collectionsCount.count}`,
  );
};

const productCount = async () => {
  const { data } = await adminRequest(`{ productsCount{ count } collectionsCount{ count } }`);
  return { collections: data.collectionsCount.count, products: data.productsCount.count };
};

const listProducts = () =>
  fetchAll(
    `query($cursor: String, $first: Int!){ products(first:$first, after:$cursor){ pageInfo{ hasNextPage endCursor } edges{ node{ id title vendor tags } } } }`,
    'products',
  );

const listCollections = () =>
  fetchAll(
    `query($cursor: String, $first: Int!){ collections(first:$first, after:$cursor){ pageInfo{ hasNextPage endCursor } edges{ node{ id handle } } } }`,
    'collections',
  );

const isProtected = (product) => (product.tags ?? []).some((tag) => tag.startsWith('bucket:'));

const deleteProducts = async (options) => {
  const products = await listProducts();
  const targets = products.filter((product) => !isProtected(product));

  console.info(
    `${products.length} products, ${targets.length} to delete, ${products.length - targets.length} protected.`,
  );

  if (!options.confirm) {
    console.info('Dry run — pass --confirm to delete.');
    console.info(
      `  e.g. ${targets
        .slice(0, 5)
        .map((product) => product.title)
        .join(' | ')}`,
    );
    return;
  }

  const concurrency = Number(options.concurrency ?? 4);
  let failures = 0;

  await mapLimit(targets, concurrency, async (product) => {
    try {
      const { data, cost } = await adminRequest(
        `mutation($input: ProductDeleteInput!){ productDelete(input:$input){ deletedProductId userErrors{ field message } } }`,
        { input: { id: product.id } },
      );
      throwOnUserErrors(data.productDelete, 'productDelete');

      const available = cost?.throttleStatus?.currentlyAvailable ?? 1000;
      if (available < 120) await sleep(1000);
    } catch (error) {
      failures += 1;
      console.error(`  failed ${product.id}: ${error instanceof Error ? error.message : error}`);
    }
  });

  console.info(
    `Deleted ${targets.length - failures}/${targets.length} products${failures ? ` (${failures} failed)` : ''}.`,
  );
};

const deleteCollections = async (options) => {
  const collections = await listCollections();
  const targets = collections.filter((collection) => !KEEP_COLLECTIONS.has(collection.handle));

  console.info(
    `${collections.length} collections, ${targets.length} to delete, kept: ${[...KEEP_COLLECTIONS].filter((handle) => collections.some((c) => c.handle === handle)).join(', ')}`,
  );

  if (!options.confirm) {
    console.info('Dry run — pass --confirm to delete.');
    console.info(`  ${targets.map((collection) => collection.handle).join(', ')}`);
    return;
  }

  let failures = 0;

  for (const collection of targets) {
    try {
      const { data } = await adminRequest(
        `mutation($id: ID!){ collectionDelete(input:{id:$id}){ deletedCollectionId userErrors{ field message } } }`,
        { id: collection.id },
      );
      throwOnUserErrors(data.collectionDelete, 'collectionDelete');
      console.info(`  deleted ${collection.handle}`);
    } catch (error) {
      failures += 1;
      console.error(
        `  failed ${collection.handle}: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  console.info(
    `Deleted ${targets.length - failures}/${targets.length} collections${failures ? ` (${failures} failed)` : ''}.`,
  );
};

const [command = 'count', ...rest] = process.argv.slice(2);
const options = parseArgs(rest);

try {
  if (command === 'count') {
    const before = await productCount();
    console.info(`before: ${JSON.stringify(before)}`);
  } else if (command === 'products') {
    await deleteProducts(options);
  } else if (command === 'collections') {
    await deleteCollections(options);
  } else if (command === 'all') {
    await deleteProducts(options);
    await deleteCollections(options);
  } else {
    console.error('Usage: shopify-reset-catalog.mjs <count|products|collections|all> [--confirm]');
    process.exit(2);
  }
} catch (error) {
  console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
