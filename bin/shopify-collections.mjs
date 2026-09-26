#!/usr/bin/env node
/**
 * Enrich the pet collections: description, SEO, sort order, cover image and
 * featured metafields — the storefront pulls all of these (see
 * `src/components/CollectionCard.tsx`, `src/app/collections/[collectionSlug]`).
 *
 * Dry-run first, then apply:
 *   node bin/shopify-collections.mjs            # preview
 *   node bin/shopify-collections.mjs --confirm  # write
 *
 * Cover images reuse an existing product's Shopify-hosted image, so the
 * storefront CSP (cdn.shopify.com only) stays satisfied.
 */
import { adminRequest, parseArgs, throwOnUserErrors } from './hertwill-shared.mjs';

const FEATURED = new Set(['dogs', 'cats', 'walk-travel', 'home-comfort', 'new-arrivals']);

/**
 * `imageFrom` is a product handle; its featured image becomes the collection
 * cover. `rule` (optional) creates a smart collection by product tag.
 */
const COLLECTIONS = [
  {
    description: 'Every product in the collection.',
    handle: 'all-products',
    imageFrom: 'hano-dog-cat-bed-with-removable-cover-brown-xxxl',
    rule: ['VARIANT_PRICE', 'GREATER_THAN', '0'],
    seoDescription:
      'Browse every premium pet product in the collection — dog and cat essentials made in Europe.',
    seoTitle: 'All Pet Products | Premium Dog & Cat Essentials',
    sortOrder: 'BEST_SELLING',
    title: 'All Products',
  },
  {
    description:
      'Everyday essentials for dogs — beds, carriers, harnesses and feeding pieces chosen for comfort, function and quiet good looks.',
    featured: true,
    handle: 'dogs',
    imageFrom: 'hano-dog-cat-bed-with-removable-cover-brown-xxxl',
    rule: ['TAG', 'EQUALS', 'type:dog'],
    seoDescription:
      'Premium dog beds, carriers, harnesses and feeders made in Europe. Free EU shipping over €80 and 30-day returns.',
    seoTitle: 'Dog Beds, Carriers & Harnesses | Premium European Dog Essentials',
    sortOrder: 'BEST_SELLING',
    title: 'Dogs',
  },
  {
    description:
      'Considered pieces for cats, from cosy beds and cat trees to feeding that suits a modern home.',
    featured: true,
    handle: 'cats',
    imageFrom: 'danoo-cat-tree-with-hammock-and-den-grey',
    rule: ['TAG', 'EQUALS', 'type:cat'],
    seoDescription:
      'Designer cat beds, trees and accessories made in Europe. Comfortable, modern pieces for cats that suit your home.',
    seoTitle: 'Cat Beds, Trees & Accessories | Modern Cat Essentials',
    sortOrder: 'BEST_SELLING',
    title: 'Cats',
  },
  {
    description: 'Carriers, harnesses and leads for calm journeys and easy everyday walks.',
    featured: true,
    handle: 'walk-travel',
    imageFrom: 'doudou-teddy-dog-carrier-bag-vanilla-m',
    rule: ['TAG', 'EQUALS', 'bucket:walk-travel'],
    seoDescription:
      'Dog carriers, harnesses and leads built for everyday walks and easy travel. European quality, EU shipping.',
    seoTitle: 'Dog Carriers, Harnesses & Leads | Walk & Travel',
    sortOrder: 'BEST_SELLING',
    title: 'Walk & Travel',
  },
  {
    description: 'Beds, mattresses and nests designed to disappear into a modern interior.',
    featured: true,
    handle: 'home-comfort',
    imageFrom: 'hano-dog-cat-bed-with-removable-cover-brown-xxxl',
    rule: ['TAG', 'EQUALS', 'bucket:home-comfort'],
    seoDescription:
      'Premium dog and cat beds, mattresses and cushions in warm, natural tones. Made in Europe, delivered across the EU.',
    seoTitle: 'Premium Dog & Cat Beds | Home & Comfort',
    sortOrder: 'BEST_SELLING',
    title: 'Home & Comfort',
  },
  {
    description: 'Toys and cat furniture that keep curious pets busy and content.',
    handle: 'play-enrichment',
    imageFrom: 'danoo-cat-tree-with-hammock-and-den-grey',
    rule: ['TAG', 'EQUALS', 'bucket:play'],
    seoDescription:
      'Cat trees, toys and enrichment for curious dogs and cats. Thoughtfully selected and made to last.',
    seoTitle: 'Pet Toys & Cat Trees | Play & Enrichment',
    sortOrder: 'BEST_SELLING',
    title: 'Play & Enrichment',
  },
  {
    description: 'Bowls, feeders and treat bags with a clean, considered finish.',
    handle: 'feeding',
    imageFrom: 'dog-treat-bag-boho',
    rule: ['TAG', 'EQUALS', 'bucket:feeding'],
    seoDescription:
      'Ceramic bowls, feeders and treat bags for dogs and cats. Clean design, easy to live with.',
    seoTitle: 'Pet Bowls, Feeders & Treat Bags | Feeding',
    sortOrder: 'BEST_SELLING',
    title: 'Feeding',
  },
  {
    description: 'The latest additions to the collection — new pieces as they arrive.',
    featured: true,
    handle: 'new-arrivals',
    imageFrom: 'danoo-cat-tree-with-hammock-and-den-grey',
    manualProducts: true,
    seoDescription:
      'The newest premium pet essentials — dog and cat pieces added to the collection this season.',
    seoTitle: 'New Arrivals | Premium Pet Essentials',
    sortOrder: 'CREATED_DESC',
    title: 'New Arrivals',
  },
  {
    description: 'Pieces crafted by European makers and workshops.',
    handle: 'made-in-europe',
    imageFrom: 'doudou-teddy-dog-carrier-bag-vanilla-m',
    rule: ['TAG', 'EQUALS', 'made-in-europe'],
    seoDescription:
      'Premium pet products made in Europe — responsibly crafted by European brands and workshops.',
    seoTitle: 'Made in Europe | Premium Pet Products',
    sortOrder: 'BEST_SELLING',
    title: 'Made in Europe',
  },
];

const listCollections = async () => {
  const { data } = await adminRequest(`{ collections(first:100){ edges{ node{ id handle } } } }`);
  return new Map(data.collections.edges.map((edge) => [edge.node.handle, edge.node.id]));
};

const listProductImages = async () => {
  const images = new Map();
  let cursor = null;
  let hasNext = true;

  while (hasNext) {
    const { data } = await adminRequest(
      `query($cursor: String){ products(first:100, after:$cursor){ pageInfo{ hasNextPage endCursor } edges{ node{ handle featuredImage{ url altText } } } } }`,
      { cursor },
    );
    for (const edge of data.products.edges) {
      if (edge.node.featuredImage?.url) {
        images.set(edge.node.handle, edge.node.featuredImage);
      }
    }
    hasNext = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return images;
};

const listProductIds = async () => {
  const { data } = await adminRequest(`{ products(first:50){ edges{ node{ id } } } }`);
  return data.products.edges.map((edge) => edge.node.id);
};

const listPublications = async () => {
  const { data } = await adminRequest(`{ publications(first:20){ edges{ node{ id } } } }`);
  return data.publications.edges.map((edge) => edge.node.id);
};

const ensureCollections = async (options) => {
  const existing = await listCollections();
  const images = await listProductImages();
  const productIds = await listProductIds();
  const publicationIds = await listPublications();
  const inputs = [];

  for (const collection of COLLECTIONS) {
    const image = images.get(collection.imageFrom);
    const id = existing.get(collection.handle);
    const input = {
      descriptionHtml: `<p>${collection.description}</p>`,
      handle: collection.handle,
      image: image
        ? { altText: image.altText || `${collection.title} collection`, src: image.url }
        : undefined,
      seo: { description: collection.seoDescription, title: collection.seoTitle },
      sortOrder: collection.sortOrder,
      title: collection.title,
    };

    if (collection.manualProducts) {
      // `products` is only accepted on create; updates keep the existing set.
      if (!id) input.products = productIds;
    } else if (collection.rule) {
      const [column, relation, condition] = collection.rule;
      input.ruleSet = { appliedDisjunctively: false, rules: [{ column, condition, relation }] };
    }

    inputs.push({ id, input });
  }

  console.info(`${COLLECTIONS.length} collections (${existing.size} existing).`);

  if (!options.confirm) {
    for (const { id, input } of inputs) {
      console.info(
        `  ${id ? 'update' : 'create'} ${input.handle} — ${input.title} [${input.sortOrder}]${input.image ? ' +cover' : ''}`,
      );
    }
    console.info('Dry run — pass --confirm to write.');
    return;
  }

  const byHandle = new Map();

  for (const { id, input } of inputs) {
    const mutation = id
      ? `mutation($input: CollectionInput!){ collectionUpdate(input:$input){ collection{ id handle } userErrors{ field message } } }`
      : `mutation($input: CollectionInput!){ collectionCreate(input:$input){ collection{ id handle } userErrors{ field message } } }`;
    const variables = id ? { input: { ...input, id } } : { input };
    const result = await adminRequest(mutation, variables);
    const payload = result.data.collectionUpdate ?? result.data.collectionCreate;
    throwOnUserErrors(payload, id ? 'collectionUpdate' : 'collectionCreate');
    byHandle.set(payload.collection.handle, payload.collection.id);
    console.info(`  ${id ? 'updated' : 'created'} ${payload.collection.handle}`);
  }

  // Featured metafields drive the home "Explore our collections" section.
  const featuredInputs = COLLECTIONS.filter((collection) => FEATURED.has(collection.handle))
    .map((collection) => ({
      key: 'featured',
      namespace: 'custom',
      ownerId: byHandle.get(collection.handle),
      type: 'boolean',
      value: 'true',
    }))
    .filter((metafield) => metafield.ownerId);

  const featured = await adminRequest(
    `mutation($metafields: [MetafieldsSetInput!]!){ metafieldsSet(metafields:$metafields){ userErrors{ field message } } }`,
    { metafields: featuredInputs },
  );
  throwOnUserErrors(featured.data.metafieldsSet, 'metafieldsSet');
  console.info(
    `  featured: ${COLLECTIONS.filter((c) => FEATURED.has(c.handle))
      .map((c) => c.handle)
      .join(', ')}`,
  );

  for (const [handle, id] of byHandle) {
    const published = await adminRequest(
      `mutation($id: ID!, $input: [PublicationInput!]!){ publishablePublish(id:$id, input:$input){ userErrors{ field message } } }`,
      { id, input: publicationIds.map((publicationId) => ({ publicationId })) },
    );
    throwOnUserErrors(published.data.publishablePublish, `publishablePublish ${handle}`);
  }
  console.info('  published all collections');
};

const options = parseArgs(process.argv.slice(2));

try {
  await ensureCollections(options);
} catch (error) {
  console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
