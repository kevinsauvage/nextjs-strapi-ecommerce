import { notFound } from 'next/navigation';

import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination/PageInfoPagination';
import ProductsList from '@/components/ProductList/ProductsList';
import ProductListHeader from '@/components/ProductListHeader/ProductListHeader';
import Search from '@/components/SearchForm/SearchForm';
import seo from '@/data/seo';
import {
  adjustPaginationVariables,
  buildShopifySearchQuery,
  parseFiltersQuery,
} from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';
import type { ProductFieldsFragment, SearchProductsQuery } from '@/shopify/storefront';
import { SearchSortKeys } from '@/shopify/storefront';

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
      first: 10,
    }),
    identifiers: [],
    productFilters: parseFiltersQuery(searchParameters?.filters),
    query: buildShopifySearchQuery(searchParameters.searchQuery),
    sortKey: SearchSortKeys[sortKey] || SearchSortKeys.Relevance,
  });

  if (!response?.search?.edges) {
    notFound();
  }

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
      <PageBanner title={seo.search.title} />
      <Breadcrumbs />
      <Search searchQuery={searchParameters.searchQuery} />
      <Container size="medium">
        <ProductListHeader
          searchParameters={searchParameters}
          sortingOptions={sortingOptions}
          filters={filters}
          sortQuery={{ sort_key: searchParameters?.sort_key || SearchSortKeys.Relevance }}
        />
        {products?.length > 0 ? (
          <>
            <ProductsList layout="grid" products={products} />
            <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
          </>
        ) : (
          <EmptyState
            title="Result Not Found"
            subtitle="Please try again with another keywords or maybe use generic term"
            altText="Result Not Found"
          />
        )}
      </Container>
    </div>
  );
};

export default Page;
