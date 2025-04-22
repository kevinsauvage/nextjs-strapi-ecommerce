import { notFound } from 'next/navigation';

import { filter } from '@/assets/svg';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination/PageInfoPagination';
import ProductsList from '@/components/ProductList/ProductsList';
import Search from '@/components/SearchForm/SearchForm';
import SlideIn from '@/components/SlideIn/SlideIn';
import seo from '@/data/seo';
import { adjustPaginationVariables, parseFiltersQuery } from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';
import type { ProductFieldsFragment, SearchProductsQuery } from '@/shopify/storefront';
import { SearchSortKeys } from '@/shopify/storefront';

import Filters from '../[genre]/_components/Filters/Filters';
import Sort from '../[genre]/_components/Sort/Sort';

import styles from './page.module.scss';

type SearchParameters = {
  searchQuery: string;
  after?: string;
  before?: string;
  sort_key?: string;
  filters?: string;
  reverse?: boolean;
};

const buildShopifySearchQuery = (query: string) => {
  if (!query) {
    return '';
  }
  const trimmed = query.trim();

  if (trimmed.includes(' ')) {
    return `"${trimmed}"`;
  }

  return `${trimmed}*`;
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
        <div className={styles.search}>
          <div className={styles.search__header}>
            <Sort
              query={
                searchParameters?.sort_key
                  ? searchParameters
                  : { sort_key: SearchSortKeys.Relevance }
              }
              sortingOptions={sortingOptions}
            />

            <SlideIn
              headerTitle="Filters"
              title={
                <span className={styles.filter__button}>
                  <p>Filters</p>
                  {filter}
                </span>
              }
            >
              <Filters filters={filters} query={searchParameters} />
            </SlideIn>
          </div>
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
        </div>
      </Container>
    </div>
  );
};

export default Page;
