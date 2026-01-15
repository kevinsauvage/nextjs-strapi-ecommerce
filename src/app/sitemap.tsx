import type { MetadataRoute } from 'next';

import { sitemap as sitemapConfig } from '@/config';
import { getBaseUrl } from '@/lib/server/metadata';

import { GraphQLClient } from 'graphql-request';
import gql from 'graphql-tag';

export const dynamic = 'force-static';

export const revalidate = 3600; // Revalidate every hour

const PAGINATION_CONFIG = {
  pageSize: 50,
  maxConsecutiveErrors: 3,
  requestDelay: 100, // ms between requests
  maxRetryDelay: 5000, // ms
  baseRetryDelay: 1000, // ms
} as const;

/**
 * Minimal GraphQL queries for sitemap generation.
 * Only fetches handle and updatedAt to avoid Next.js 2MB cache limit.
 */
const GET_PRODUCTS_FOR_SITEMAP = gql`
  query getProductsForSitemap($first: Int, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`;

const GET_COLLECTIONS_FOR_SITEMAP = gql`
  query getCollectionsForSitemap($first: Int, $after: String) {
    collections(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`;

type SitemapItem = {
  handle: string;
  updatedAt?: string;
};

type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

type GraphQLResponse<T extends 'products' | 'collections'> = {
  [K in T]: {
    pageInfo: PageInfo;
    edges: Array<{ node: SitemapItem }>;
  };
};

/**
 * Creates a GraphQL client optimized for static generation.
 * Uses cacheable fetch to allow static rendering without dynamic server usage.
 */
function createSitemapClient(): GraphQLClient {
  const shopifyUrl = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL;
  const accessToken = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN;

  if (!shopifyUrl || !accessToken) {
    throw new Error('Missing Shopify configuration for sitemap generation');
  }

  return new GraphQLClient(shopifyUrl, {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await fetch(input, {
        ...init,
        next: { revalidate },
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      return response;
    },
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken,
    },
  });
}

const sitemapClient = createSitemapClient();

/**
 * Calculates exponential backoff delay for retries.
 */
function calculateRetryDelay(attempt: number): number {
  const delay = PAGINATION_CONFIG.baseRetryDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, PAGINATION_CONFIG.maxRetryDelay);
}

/**
 * Delays execution by the specified milliseconds.
 */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Extracts items from GraphQL response edges.
 */
function extractItems<T extends 'products' | 'collections'>(
  response: GraphQLResponse<T>,
  key: T,
): SitemapItem[] {
  const data = response[key];
  if (!data?.edges) return [];

  return data.edges
    .map((edge) => edge?.node)
    .filter((node): node is SitemapItem => Boolean(node?.handle));
}

type PaginationState = {
  hasNextPage: boolean;
  cursor: string | null;
  consecutiveErrors: number;
};

type PaginationResult = {
  items: SitemapItem[];
  hasPartialData: boolean;
};

/**
 * Handles a successful pagination request.
 * Mutates state object to track pagination progress.
 */
function handlePaginationSuccess<T extends 'products' | 'collections'>(
  response: GraphQLResponse<T>,
  queryKey: T,
  extract: (response: GraphQLResponse<T>) => SitemapItem[],
  state: PaginationState,
): SitemapItem[] {
  const pageItems = extract(response);
  const pageInfo = response[queryKey]?.pageInfo;

  // eslint-disable-next-line no-param-reassign
  state.hasNextPage = pageInfo?.hasNextPage ?? false;
  // eslint-disable-next-line no-param-reassign
  state.cursor = pageInfo?.endCursor ?? null;
  // eslint-disable-next-line no-param-reassign
  state.consecutiveErrors = 0;

  return pageItems;
}

/**
 * Logs pagination error with context.
 */
function logPaginationError(
  error: unknown,
  queryKey: 'products' | 'collections',
  attempt: number,
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.warn(
    `Error fetching ${queryKey} page (attempt ${attempt}/${PAGINATION_CONFIG.maxConsecutiveErrors}):`,
    errorMessage,
  );
}

/**
 * Handles graceful degradation when partial data is available.
 */
function handlePartialData(
  items: SitemapItem[],
  queryKey: 'products' | 'collections',
): { shouldContinue: boolean; hasPartialData: boolean } | null {
  if (items.length === 0) return null;

  console.warn(
    `Continuing with ${items.length} ${queryKey} already fetched. API error may be temporary.`,
  );
  return { shouldContinue: false, hasPartialData: true };
}

/**
 * Handles pagination errors with retry logic and graceful degradation.
 * Mutates state object to track error count.
 */
async function handlePaginationError(
  error: unknown,
  queryKey: 'products' | 'collections',
  items: SitemapItem[],
  state: PaginationState,
): Promise<{ shouldContinue: boolean; hasPartialData: boolean }> {
  // eslint-disable-next-line no-param-reassign
  state.consecutiveErrors++;
  logPaginationError(error, queryKey, state.consecutiveErrors);

  // Graceful degradation: if we have partial data, return it
  const partialDataResult = handlePartialData(items, queryKey);
  if (partialDataResult) return partialDataResult;

  // Retry with exponential backoff
  const canRetry = state.consecutiveErrors < PAGINATION_CONFIG.maxConsecutiveErrors;
  if (canRetry) {
    const retryDelay = calculateRetryDelay(state.consecutiveErrors);
    await wait(retryDelay);
    return { shouldContinue: true, hasPartialData: false };
  }

  // All retries exhausted
  throw error;
}

/**
 * Generic pagination function for fetching Shopify data.
 * Handles retries, exponential backoff, and graceful degradation.
 */
async function paginateShopifyData<T extends 'products' | 'collections'>({
  query,
  queryKey,
  extractItems: extract,
}: {
  query: ReturnType<typeof gql>;
  queryKey: T;
  extractItems: (response: GraphQLResponse<T>) => SitemapItem[];
}): Promise<PaginationResult> {
  const items: SitemapItem[] = [];
  const state: PaginationState = {
    hasNextPage: true,
    cursor: null,
    consecutiveErrors: 0,
  };

  while (state.hasNextPage && state.consecutiveErrors < PAGINATION_CONFIG.maxConsecutiveErrors) {
    try {
      // Sequential await required for pagination - each request depends on previous cursor
      // eslint-disable-next-line no-await-in-loop
      const response = await sitemapClient.request<GraphQLResponse<T>>(query, {
        first: PAGINATION_CONFIG.pageSize,
        after: state.cursor || undefined,
      });

      const pageItems = handlePaginationSuccess(response, queryKey, extract, state);
      items.push(...pageItems);

      // Rate limiting: delay between requests
      if (state.hasNextPage) {
        // Sequential await required for rate limiting
        // eslint-disable-next-line no-await-in-loop
        await wait(PAGINATION_CONFIG.requestDelay);
      }
    } catch (error) {
      // Sequential await required for error handling and retry logic
      // eslint-disable-next-line no-await-in-loop
      const errorResult = await handlePaginationError(error, queryKey, items, state);

      if (!errorResult.shouldContinue) {
        return { items, hasPartialData: errorResult.hasPartialData };
      }
    }
  }

  return { items, hasPartialData: false };
}

async function getAllProducts(): Promise<SitemapItem[]> {
  const result = await paginateShopifyData({
    query: GET_PRODUCTS_FOR_SITEMAP,
    queryKey: 'products',
    extractItems: (response) => extractItems(response, 'products'),
  });

  return result.items;
}

async function getAllCollections(): Promise<SitemapItem[]> {
  const result = await paginateShopifyData({
    query: GET_COLLECTIONS_FOR_SITEMAP,
    queryKey: 'collections',
    extractItems: (response) => extractItems(response, 'collections'),
  });

  return result.items;
}

function getBaseSitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  return sitemapConfig.map((item) => ({
    changeFrequency: item.changeFrequency,
    lastModified: item.lastModified,
    priority: item.priority,
    url: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
  }));
}

function createSitemapEntry(
  item: SitemapItem,
  baseUrl: string,
  pathPrefix: string,
  changeFrequency: 'daily' | 'weekly' | 'monthly',
  priority: number,
): MetadataRoute.Sitemap[0] {
  return {
    url: `${baseUrl}${pathPrefix}/${item.handle}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    changeFrequency,
    priority,
  };
}

function getProductSitemapEntries(products: SitemapItem[], baseUrl: string): MetadataRoute.Sitemap {
  return products.map((product) =>
    createSitemapEntry(product, baseUrl, '/collections/products', 'weekly', 0.7),
  );
}

function getCollectionSitemapEntries(
  collections: SitemapItem[],
  baseUrl: string,
): MetadataRoute.Sitemap {
  return collections.map((collection) =>
    createSitemapEntry(collection, baseUrl, '/collections', 'daily', 0.8),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const baseSitemap = getBaseSitemap();

  try {
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
    return baseSitemap;
  }
}
