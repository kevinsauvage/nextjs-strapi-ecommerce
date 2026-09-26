import type { Metadata } from 'next';

import BestSellersRail from '@/components/BestSellersRail';
import Breadcrumbs from '@/components/Breadcrumbs';
import EmptyState from '@/components/EmptyState';
import ListingHeader from '@/components/ListingHeader';
import Link from '@/components/LocalizedLink';
import PageBanner from '@/components/PageBanner';
import PageInfoPagination from '@/components/PageInfoPagination';
import ProductsList from '@/components/ProductsList';
import RecentSearches from '@/components/RecentSearches';
import Search from '@/components/Search';
import SearchAnalytics from '@/components/SearchAnalytics';
import { Button } from '@/components/ui/button';
import config from '@/config';
import seo from '@/data/seo';
import { getTranslations, localeFromParams } from '@/i18n/server';
import { normalizeSortKey } from '@/lib/server/collection';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { getPopularSearchTerms } from '@/lib/server/popularSearches';
import { getStorefront } from '@/lib/server/storefront';
import {
  adjustPaginationVariables,
  buildShopifySearchQuery,
  parseFiltersQuery,
} from '@/shopify/helpers';
import type {
  ProductFieldsFragment,
  SearchProductsQuery,
  SearchSortKeys,
} from '@/shopify/storefront';

import Filters from '../collections/_components/Filters';
import Sort from '../collections/_components/Sort';

/**
 * Customer-specific: this page reads the visitor's Shopify session (and, for the
 * form pages, request-time query parameters), so it cannot be prerendered.
 * Blocking is the correct trade — the content is per-visitor, and the catalog
 * pages that carry the traffic stay static.
 */
export const instant = false;

/** Valid `SearchSortKeys` values, for runtime query-param parsing. */
const SEARCH_SORT_KEYS = ['PRICE', 'RELEVANCE'] as const satisfies readonly SearchSortKeys[];

const resolveSearchSortKey = (raw?: string): SearchSortKeys => {
  const normalized = raw ? normalizeSortKey(raw) : '';

  return SEARCH_SORT_KEYS.find((key) => normalizeSortKey(key) === normalized) ?? 'RELEVANCE';
};

/**
 * The locale is part of the route, so the canonical URL and the `hreflang`
 * alternates have to be resolved per language rather than declared statically.
 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> =>
  generateMetadataUtil({
    title: seo.search.title,
    description: seo.search.description,
    url: config.routes.search,
    noindex: true, // Search result pages have no crawl value and are disallowed in robots.ts
    locale: await localeFromParams(params),
  });

type SearchParameters = {
  searchQuery: string;
  after?: string;
  before?: string;
  sort_key?: string;
  filters?: string;
  reverse?: boolean;
};

/** Shared banner so the empty-query early return below duplicates no markup. */
const SearchBanner = ({
  searchQuery,
  popularTerms,
  title,
  eyebrow,
  description,
  popularLabel,
}: {
  searchQuery?: string;
  popularTerms: string[];
  title: string;
  eyebrow: string;
  description: string;
  popularLabel: string;
}) => (
  <PageBanner title={title} eyebrow={eyebrow} description={description}>
    <Breadcrumbs path={config.routes.search} />
    <Search key={searchQuery ?? ''} searchQuery={searchQuery ?? ''} />
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-caption text-secondary">{popularLabel}</span>
      {popularTerms.map((term) => (
        <Button key={term} variant="outline" size="sm" asChild className="rounded-full">
          <Link href={`${config.routes.search}?searchQuery=${encodeURIComponent(term)}`}>
            {term}
          </Link>
        </Button>
      ))}
    </div>
    <RecentSearches />
  </PageBanner>
);

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParameters>;
}) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'search');
  const searchParameters = await searchParams;
  const hasQuery = Boolean(searchParameters.searchQuery?.trim());
  const popularTerms = await getPopularSearchTerms(locale);

  const banner = {
    description: seo.search.description,
    eyebrow: t('eyebrow'),
    popularLabel: t('popular'),
    title: seo.search.title,
  };

  // Never burn a Storefront request on the empty state.
  if (!hasQuery) {
    return (
      <div>
        <SearchBanner
          searchQuery={searchParameters.searchQuery}
          popularTerms={popularTerms}
          {...banner}
        />
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
          <EmptyState
            variant="search"
            title={t('emptyTitle')}
            subtitle={t('emptySubtitle')}
            altText={t('emptyAlt')}
            primaryAction={
              <Button variant="default" asChild>
                <Link href={config.routes.collection}>{t('browseCollections')}</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const response: SearchProductsQuery = await (
    await getStorefront(locale)
  ).searchProducts({
    ...adjustPaginationVariables({
      after: searchParameters.after,
      before: searchParameters.before,
      first: config.constants.pagination.productsPerPage,
    }),
    identifiers: [],
    productFilters: parseFiltersQuery(searchParameters?.filters),
    query: buildShopifySearchQuery(searchParameters.searchQuery),
    sortKey: resolveSearchSortKey(searchParameters.sort_key),
  });

  const { pageInfo } = response.search;
  const filters = response.search.productFilters;

  const products = response.search?.edges.map((edge) => ({
    ...edge.node,
  })) as Array<ProductFieldsFragment>;

  const sortingOptions = [
    {
      label: t('relevance'),
      name: 'RELEVANCE',
    },
    {
      label: t('sortPrice'),
      name: 'PRICE',
    },
  ];

  return (
    <div>
      <SearchBanner
        searchQuery={searchParameters.searchQuery}
        popularTerms={popularTerms}
        {...banner}
      />
      <SearchAnalytics searchTerm={searchParameters.searchQuery} resultsCount={products.length} />
      {products.length > 0 ? (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
          <ListingHeader>
            <Sort
              query={{ sort_key: searchParameters?.sort_key || 'RELEVANCE' }}
              sortingOptions={sortingOptions}
            />
            <Filters filters={filters} query={searchParameters} />
          </ListingHeader>
          <h2 className="sr-only">{t('resultsSr')}</h2>
          <ProductsList layout="grid" products={products} />{' '}
          <PageInfoPagination
            pageInfo={pageInfo}
            searchParameters={searchParameters}
            basePath={config.routes.search}
          />
        </div>
      ) : (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
          <EmptyState
            variant="search"
            title={t('noResultsTitle')}
            subtitle={t('noResultsSubtitle')}
            altText={t('noResultsAlt')}
            primaryAction={
              <Button variant="default" asChild>
                <Link href={config.routes.collection}>{t('browseCollections')}</Link>
              </Button>
            }
            secondaryAction={
              <Link href={config.routes.contact} className="link">
                {t('noResultsHelp')}
              </Link>
            }
          />
        </div>
      )}
      {products.length === 0 && <BestSellersRail />}
    </div>
  );
};

export default Page;
