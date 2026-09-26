import type { MetadataRoute } from 'next';
import { cacheLife, cacheTag } from 'next/cache';

import config, { sitemap as sitemapConfig } from '@/config';
import { localeAlternates, LOCALES, localizedPath } from '@/i18n/routing';
import { reportError } from '@/lib/logger';
import { getBaseUrl } from '@/lib/server/metadata';
import { storefrontSdk } from '@/shopify';

const PAGE_SIZE = 250;

type SitemapItem = {
  handle: string;
  updatedAt?: string;
};

async function paginate(
  fetchPage: (after?: string) => Promise<{
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    edges: Array<{ node: SitemapItem }>;
  }>,
): Promise<SitemapItem[]> {
  const items: SitemapItem[] = [];
  let after: string | undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    // Sequential cursor pagination: each request depends on the previous cursor.
    // eslint-disable-next-line no-await-in-loop
    const page = await fetchPage(after);

    for (const edge of page.edges) {
      if (edge.node.handle) {
        items.push(edge.node);
      }
    }

    hasNextPage = page.pageInfo.hasNextPage && Boolean(page.pageInfo.endCursor);
    after = page.pageInfo.endCursor ?? undefined;
  }

  return items;
}

const getAllProducts = (): Promise<SitemapItem[]> =>
  paginate(async (after) => {
    const { products } = await storefrontSdk().getProductsForSitemap({ after, first: PAGE_SIZE });
    return products;
  });

const getAllCollections = (): Promise<SitemapItem[]> =>
  paginate(async (after) => {
    const { collections } = await storefrontSdk().getCollectionsForSitemap({
      after,
      first: PAGE_SIZE,
    });
    return collections;
  });

const getAllPages = (): Promise<SitemapItem[]> =>
  paginate(async (after) => {
    const { pages } = await storefrontSdk().getPagesForSitemap({ after, first: PAGE_SIZE });
    return pages;
  });

/**
 * Expands one canonical path into a sitemap entry per language.
 *
 * Every page is served in every supported language, so each path expands into
 * its `localizedPath` variants, each cross-linked with the full `hreflang` set
 * (including `x-default`). Without this the `/es` and `/fr` trees would only be
 * reachable through the alternates in each page's metadata.
 */
const localizedEntries = (
  path: string,
  baseUrl: string,
  now: Date,
  options: {
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
    lastModified?: Date;
  } = {},
): MetadataRoute.Sitemap =>
  LOCALES.map((locale) => ({
    alternates: { languages: localeAlternates(path, baseUrl) },
    changeFrequency: options.changeFrequency,
    lastModified: options.lastModified ?? now,
    priority: options.priority,
    url: `${baseUrl}${localizedPath(locale, path)}`,
  }));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache';
  cacheLife('hours');
  cacheTag('shopify');

  const baseUrl = getBaseUrl();
  const now = new Date();

  const [products, collections, pages] = await Promise.all([
    getAllProducts().catch((error) => {
      reportError('sitemap/products', error);
      return [] as SitemapItem[];
    }),
    getAllCollections().catch((error) => {
      reportError('sitemap/collections', error);
      return [] as SitemapItem[];
    }),
    getAllPages().catch((error) => {
      reportError('sitemap/pages', error);
      return [] as SitemapItem[];
    }),
  ]);

  const staticEntries = sitemapConfig.flatMap((entry) =>
    entry.url.startsWith('http')
      ? [{ ...entry, lastModified: now }]
      : localizedEntries(entry.url, baseUrl, now, {
          changeFrequency: entry.changeFrequency,
          priority: entry.priority,
        }),
  );

  const collectionEntries = collections.flatMap((item) =>
    localizedEntries(`${config.routes.collection}/${item.handle}`, baseUrl, now, {
      changeFrequency: 'daily',
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      priority: 0.8,
    }),
  );

  const productEntries = products.flatMap((item) =>
    localizedEntries(`${config.routes.collection}/products/${item.handle}`, baseUrl, now, {
      changeFrequency: 'weekly',
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      priority: 0.7,
    }),
  );

  const pageEntries = pages.flatMap((item) =>
    localizedEntries(`${config.routes.page}/${item.handle}`, baseUrl, now, {
      changeFrequency: 'monthly',
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      priority: 0.5,
    }),
  );

  return [...staticEntries, ...collectionEntries, ...productEntries, ...pageEntries];
}
