import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination/PageInfoPagination';
import ProductsList from '@/components/ProductList/ProductsList';
import Search from '@/components/SearchForm/SearchForm';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';
import { ProductSortKeys } from '@/shopify/storefront';

import styles from './page.module.scss';

type SearchParameters = {
  searchQuery: string;
  after?: string;
  before?: string;
  sort_key?: string;
};

const Page = async ({ searchParams }: { searchParams: Promise<SearchParameters> }) => {
  const searchParameters = await searchParams;

  const searchResponse = await storefrontSdk().getProducts({
    after: searchParameters.after || undefined,
    before: searchParameters.before,
    first: 10,
    identifiers: [],
    query: `${searchParameters.searchQuery}*`,
    sortKey:
      ProductSortKeys[searchParameters.sort_key as keyof typeof ProductSortKeys] ||
      ProductSortKeys.CreatedAt,
  });

  const pageInfo = searchResponse.products.pageInfo;
  const products = searchResponse.products.edges.map((edge) => ({
    ...edge.node,
  }));

  return (
    <div>
      <PageBanner title={seo.search.title} />
      <Breadcrumbs />
      <Search searchQuery={searchParameters.searchQuery} />
      <Container size="medium">
        <div className={styles.search}>
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
