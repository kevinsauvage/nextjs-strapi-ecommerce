import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import EmptyState from '@/components/EmptyState';
import ListingHeader from '@/components/ListingHeader';
import PageBanner from '@/components/PageBanner';
import PageInfoPagination from '@/components/PageInfoPagination';
import ProductsList from '@/components/ProductsList';
import Search from '@/components/Search';
import seo from '@/data/seo';
import {
  adjustPaginationVariables,
  buildShopifySearchQuery,
  parseFiltersQuery,
} from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';
import type { ProductFieldsFragment, SearchProductsQuery } from '@/shopify/storefront';
import { SearchSortKeys } from '@/shopify/storefront';

import Filters from '../collections/_components/Filters';
import Sort from '../collections/_components/Sort';

import { generateMetadata as generateMetadataUtil } from '@/utils/metadata';

export const revalidate = 300; // Revalidate every 5 minutes (search results change frequently)

export const metadata: Metadata = generateMetadataUtil({
  title: seo.search.title,
  description: seo.search.description,
  url: '/search',
});

type SearchParameters = {
  searchQuery: string;
  after?: string;
  before?: string;
  sort_key?: string;
  filters?: string;
  reverse?: boolean;
};

const Page = async ({ searchParams }: { searchParams: Promise<SearchParameters> }) => {
  const searchParameters = await searchParams;

  const sortKey = Object.keys(SearchSortKeys).find(
    (key) => key.toLowerCase() === searchParameters.sort_key?.toLowerCase(),
  ) as keyof typeof SearchSortKeys;

  const response: SearchProductsQuery = await storefrontSdk().searchProducts({
    ...adjustPaginationVariables({
      after: searchParameters.after,
      before: searchParameters.before,
      first: 16,
    }),
    identifiers: [],
    productFilters: parseFiltersQuery(searchParameters?.filters),
    query: buildShopifySearchQuery(searchParameters.searchQuery),
    sortKey: SearchSortKeys[sortKey] || SearchSortKeys.Relevance,
  });

  const pageInfo = response.search.pageInfo;
  const filters = response.search.productFilters;

  const products = response.search?.edges.map((edge) => ({
    ...edge.node,
  })) as Array<ProductFieldsFragment>;

  const sortingOptions = [
    {
      label: 'Relevance',
      name: SearchSortKeys.Relevance,
    },
    {
      label: 'Price, low to high',
      name: SearchSortKeys.Price,
    },
  ];

  return (
    <div>
      <PageBanner title={seo.search.title} description={seo.search.description}>
        <Breadcrumbs />
        <Search searchQuery={searchParameters.searchQuery} />
      </PageBanner>
      {products.length > 0 ? (
        <div className="container mx-auto mb-8 px-4">
          <ListingHeader>
            <Sort
              query={{ sort_key: searchParameters?.sort_key || SearchSortKeys.Relevance }}
              sortingOptions={sortingOptions}
            />
            <Filters filters={filters} query={searchParameters} />
          </ListingHeader>
          <ProductsList layout="grid" products={products} />
          <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
        </div>
      ) : (
        <div className="container mx-auto mb-8 px-4">
          <EmptyState
            title="Result Not Found"
            subtitle="Please try again with another keywords or maybe use generic term"
            altText="Result Not Found"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
