import type { MetadataRoute } from 'next';

import { sitemap as sitemapConfig } from '@/config';
import { storefrontSdk } from '@/shopify';
import { getBaseUrl } from '@/utils/metadata';

const getBaseSitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = getBaseUrl();

  return sitemapConfig.map((item) => {
    const absoluteUrl = item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`;

    return {
      changeFrequency: item.changeFrequency,
      lastModified: item.lastModified,
      priority: item.priority,
      url: absoluteUrl,
    };
  });
};

async function getAllProducts(): Promise<Array<{ handle: string; updatedAt?: string }>> {
  const allProducts: Array<{ handle: string; updatedAt?: string }> = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  const pageSize = 250; // Shopify allows up to 250 items per page
  let consecutiveErrors = 0;
  const maxConsecutiveErrors = 3;

  while (hasNextPage && consecutiveErrors < maxConsecutiveErrors) {
    try {
      const response = await storefrontSdk('no-store').getProducts({
        first: pageSize,
        after: cursor || undefined,
        identifiers: [],
      });

      const { products } = response || {};
      const { edges, pageInfo } = products || {};

      if (edges && edges.length > 0) {
        edges.forEach((edge) => {
          if (edge?.node?.handle) {
            allProducts.push({
              handle: edge.node.handle,
              updatedAt: edge.node.updatedAt,
            });
          }
        });
      }

      hasNextPage = pageInfo?.hasNextPage || false;
      cursor = pageInfo?.endCursor || null;
      consecutiveErrors = 0; // Reset error counter on success
    } catch (error) {
      consecutiveErrors++;
      console.warn(
        `Error fetching products page (attempt ${consecutiveErrors}/${maxConsecutiveErrors}):`,
        error instanceof Error ? error.message : error,
      );
      // If we have some products, continue with what we have
      if (allProducts.length > 0) {
        break;
      }
      // If this is the first page and it fails, throw to let the error handler catch it
      if (consecutiveErrors >= maxConsecutiveErrors) {
        throw error;
      }
    }
  }

  return allProducts;
}

async function getAllCollections(): Promise<Array<{ handle: string; updatedAt?: string }>> {
  const allCollections: Array<{ handle: string; updatedAt?: string }> = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  const pageSize = 250; // Shopify allows up to 250 items per page

  while (hasNextPage) {
    const response = await storefrontSdk('no-store').collections({
      first: pageSize,
      after: cursor || undefined,
      identifiers: [],
      firstProducts: 0, // Required by GraphQL query, but we don't need products
    });

    const { collections } = response || {};
    const { edges, pageInfo } = collections || {};

    if (edges && edges.length > 0) {
      edges.forEach((edge) => {
        if (edge?.node?.handle) {
          allCollections.push({
            handle: edge.node.handle,
            updatedAt: edge.node.updatedAt,
          });
        }
      });
    }

    hasNextPage = pageInfo?.hasNextPage || false;
    cursor = pageInfo?.endCursor || null;
  }

  return allCollections;
}

function getProductSitemapEntries(
  products: Array<{ handle: string; updatedAt?: string }>,
  baseUrl: string,
): MetadataRoute.Sitemap {
  return products.map((product) => ({
    url: `${baseUrl}/collections/products/${product.handle}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
}

function getCollectionSitemapEntries(
  collections: Array<{ handle: string; updatedAt?: string }>,
  baseUrl: string,
): MetadataRoute.Sitemap {
  return collections.map((collection) => ({
    url: `${baseUrl}/collections/${collection.handle}`,
    lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const baseSitemap = getBaseSitemap();

  try {
    // Fetch products and collections in parallel, but handle errors independently
    const [productsResult, collectionsResult] = await Promise.allSettled([
      getAllProducts(),
      getAllCollections(),
    ]);

    const products = productsResult.status === 'fulfilled' ? productsResult.value : [];
    const collections = collectionsResult.status === 'fulfilled' ? collectionsResult.value : [];

    if (productsResult.status === 'rejected') {
      console.warn('Failed to fetch products for sitemap:', productsResult.reason);
    }
    if (collectionsResult.status === 'rejected') {
      console.warn('Failed to fetch collections for sitemap:', collectionsResult.reason);
    }

    const productEntries = getProductSitemapEntries(products, baseUrl);
    const collectionEntries = getCollectionSitemapEntries(collections, baseUrl);

    return [...baseSitemap, ...collectionEntries, ...productEntries];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return base sitemap if dynamic generation fails completely
    return baseSitemap;
  }
}
