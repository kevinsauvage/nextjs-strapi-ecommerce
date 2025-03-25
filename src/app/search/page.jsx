import notFoundIllustration from '@/assets/NotFoundIllustration.svg';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination/PageInfoPagination';
import ProductsList from '@/components/ProductList/ProductsList';
import Search from '@/components/SearchForm/SearchForm';
import seo from '@/data/seo';
import getClient from '@/shopify/index';

import styles from './page.module.scss';

const Page = async ({ searchParams }) => {
  const searchParameters = await searchParams;

  const searchResponse = await getClient().storefront.product.getProducts({
    after: searchParameters.after || undefined,
    before: searchParameters.before,
    first: 10,
    query: `${searchParameters.searchQuery}*`,
    sortKey: searchParameters.sort_key,
  });

  const { products, pageInfo } = searchResponse || {};

  return (
    <div>
      <PageBanner title={seo.search.title} />
      <Breadcrumbs />
      <Search size="medium" searchQuery={searchParameters.searchQuery} />
      <Container size="medium">
        <div className={styles.search}>
          {products?.length > 0 ? (
            <>
              <ProductsList layout="grid" products={products} />
              <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
            </>
          ) : (
            <EmptyState
              image={notFoundIllustration}
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
