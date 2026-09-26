#!/usr/bin/env node
/**
 * Finish the Hertwill-synced products: tag them for smart collections, set the
 * product type, publish them, and create the BRAND.md navigation collections.
 *
 * Hertwill syncs products as DRAFT with empty type/tags, so this is the glue
 * that makes the storefront look like a real shop.
 *
 * Usage:
 *   node bin/shopify-curate-pets.mjs tag  [--ids a,b]     # type + tags + publish
 *   node bin/shopify-curate-pets.mjs collections          # create smart collections
 *   node bin/shopify-curate-pets.mjs apply [--ids a,b]    # tag + collections
 *
 * Products are matched by SKU from content/hertwill-pet-catalog.json.
 */
import {
  adminRequest,
  BUCKET_LABELS,
  parseArgs,
  readJson,
  throwOnUserErrors,
} from './hertwill-shared.mjs';

const MANIFEST = 'content/hertwill-pet-catalog.json';
const KEEP_COLLECTIONS = new Set(['all-products', 'all']);

/**
 * BRAND.md navigation mapped to product tags. Only collections with at least
 * one matching product are created, so the menu never links to an empty page.
 */
const COLLECTIONS = [
  { handle: 'dogs', rule: ['TAG', 'EQUALS', 'type:dog'], title: 'Dogs' },
  { handle: 'cats', rule: ['TAG', 'EQUALS', 'type:cat'], title: 'Cats' },
  { handle: 'walk-travel', rule: ['TAG', 'EQUALS', 'bucket:walk-travel'], title: 'Walk & Travel' },
  {
    handle: 'home-comfort',
    rule: ['TAG', 'EQUALS', 'bucket:home-comfort'],
    title: 'Home & Comfort',
  },
  { handle: 'play-enrichment', rule: ['TAG', 'EQUALS', 'bucket:play'], title: 'Play & Enrichment' },
  { handle: 'feeding', rule: ['TAG', 'EQUALS', 'bucket:feeding'], title: 'Feeding' },
  { handle: 'care-grooming', rule: ['TAG', 'EQUALS', 'bucket:grooming'], title: 'Care & Grooming' },
];

const productTags = (product) => {
  const tags = [`bucket:${product.bucket}`, `brand:${product.brandSlug}`];

  if (product.petType === 'dog' || product.petType === 'dog-cat' || product.petType === 'pet') {
    tags.push('type:dog');
  }
  if (product.petType === 'cat' || product.petType === 'dog-cat') {
    tags.push('type:cat');
  }
  if (product.collections.includes('made-in-europe')) tags.push('made-in-europe');
  if (product.collections.includes('handmade')) tags.push('handmade');
  if (product.collections.includes('sustainable')) tags.push('sustainable');

  return tags;
};

const findBySku = async (sku) => {
  const { data } = await adminRequest(
    `query($q: String!){ productVariants(first:1, query:$q){ edges{ node{ product{ id title status } } } } }`,
    { q: `sku:${sku}` },
  );

  return data.productVariants.edges[0]?.node?.product ?? null;
};

const findByHandle = async (handle) => {
  const { data } = await adminRequest(
    `query($q: String!){ products(first:1, query:$q){ edges{ node{ id title status } } } }`,
    { q: `handle:${handle}` },
  );

  return data.products.edges[0]?.node ?? null;
};

/**
 * Hertwill SKUs are not always the SKU Shopify stores (variant items keep the
 * per-variant SKU, others use the slug), so try every candidate plus the handle.
 */
const findProduct = async (product) => {
  const skus = [product.sku, ...product.variations.map((variation) => variation.sku)].filter(
    Boolean,
  );

  for (const sku of skus) {
    const match = await findBySku(sku);
    if (match) return match;
  }

  return findByHandle(product.slug);
};

const listPublications = async () => {
  const { data } = await adminRequest(`{ publications(first:20){ edges{ node{ id name } } } }`);
  return data.publications.edges.map((edge) => edge.node);
};

const publish = async (id, publications) => {
  const { data } = await adminRequest(
    `mutation($id: ID!, $input: [PublicationInput!]!){ publishablePublish(id:$id, input:$input){ userErrors{ field message } } }`,
    { id, input: publications.map((publication) => ({ publicationId: publication.id })) },
  );
  throwOnUserErrors(data.publishablePublish, 'publishablePublish');
};

const tagProducts = async (products, options) => {
  const publications = await listPublications();
  let done = 0;
  const missing = [];

  for (const product of products) {
    const match = await findProduct(product);

    if (!match) {
      missing.push(product.id);
      continue;
    }

    if (!options['dry-run']) {
      const tags = productTags(product);
      const tagged = await adminRequest(
        `mutation($id: ID!, $tags: [String!]!){ tagsAdd(id:$id, tags:$tags){ userErrors{ field message } } }`,
        { id: match.id, tags },
      );
      throwOnUserErrors(tagged.data.tagsAdd, 'tagsAdd');

      const updated = await adminRequest(
        `mutation($input: ProductInput!){ productUpdate(input:$input){ product{ id status productType } userErrors{ field message } } }`,
        {
          input: {
            id: match.id,
            productType: BUCKET_LABELS[product.bucket] ?? product.bucket,
            status: 'ACTIVE',
          },
        },
      );
      throwOnUserErrors(updated.data.productUpdate, 'productUpdate');

      await publish(match.id, publications);
    }

    done += 1;
    console.info(
      `  ${options['dry-run'] ? '[dry-run] ' : ''}tagged ${match.title} [${productTags(product).join(', ')}]`,
    );
  }

  console.info(`Tagged and published ${done} products.`);

  if (missing.length > 0) {
    console.info(`Not synced yet (${missing.length}): ${missing.join(', ')}`);
  }
};

const collectionCounts = (products) => {
  const counts = new Map();

  for (const product of products) {
    const tags = productTags(product);
    for (const collection of COLLECTIONS) {
      if (tags.includes(collection.rule[2])) {
        counts.set(collection.handle, (counts.get(collection.handle) ?? 0) + 1);
      }
    }
  }

  return counts;
};

const ensureCollections = async (products, options) => {
  const counts = collectionCounts(products);
  const { data: existing } = await adminRequest(
    `{ collections(first:100){ edges{ node{ id handle } } } }`,
  );
  const byHandle = new Map(
    existing.collections.edges.map((edge) => [edge.node.handle, edge.node.id]),
  );
  const publications = await listPublications();

  for (const collection of COLLECTIONS) {
    const count = counts.get(collection.handle) ?? 0;

    if (count === 0) {
      console.info(`  skip ${collection.handle}: 0 products`);
      continue;
    }

    if (options['dry-run']) {
      console.info(`  [dry-run] would upsert ${collection.handle} (${count} products)`);
      continue;
    }

    const id = byHandle.get(collection.handle);
    const [column, relation, condition] = collection.rule;
    const ruleSet = {
      appliedDisjunctively: false,
      rules: [{ column, condition, relation }],
    };

    const mutation = id
      ? `mutation($id: ID!, $input: CollectionInput!){ collectionUpdate(id:$id, input:$input){ collection{ id handle } userErrors{ field message } } }`
      : `mutation($input: CollectionInput!){ collectionCreate(input:$input){ collection{ id handle } userErrors{ field message } } }`;

    const variables = id
      ? { id, input: { ruleSet } }
      : { input: { handle: collection.handle, ruleSet, title: collection.title } };

    const result = await adminRequest(mutation, variables);
    const payload = result.data.collectionUpdate ?? result.data.collectionCreate;
    throwOnUserErrors(payload, id ? 'collectionUpdate' : 'collectionCreate');

    const collectionId = payload.collection.id;
    await publish(collectionId, publications);

    console.info(`  ${id ? 'updated' : 'created'} ${collection.handle} (${count} products)`);
  }
};

const [command = 'apply', ...rest] = process.argv.slice(2);
const options = parseArgs(rest);

try {
  const manifest = readJson(options.manifest ?? MANIFEST);
  let products = manifest.products;

  if (options.ids) {
    const wanted = new Set(
      String(options.ids)
        .split(',')
        .map((value) => Number(value.trim())),
    );
    products = products.filter((product) => wanted.has(product.id));
  } else if (!options.all) {
    // Default: only products this tooling synced (tracked in the import list).
    const synced = readJson('content/hertwill-import-list.json');
    products = products.filter((product) => synced.items?.[product.id]?.status === 'synced');
  }

  if (command === 'tag') {
    await tagProducts(products, options);
  } else if (command === 'collections') {
    await ensureCollections(manifest.products, options);
  } else if (command === 'apply') {
    await tagProducts(products, options);
    await ensureCollections(manifest.products, options);
  } else {
    console.error('Usage: shopify-curate-pets.mjs <tag|collections|apply> [--ids a,b] [--dry-run]');
    process.exit(2);
  }
} catch (error) {
  console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
