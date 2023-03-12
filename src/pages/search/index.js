import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import notFoundIllustration from '@/assets/NotFoundIllustration.svg';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import Search from '@/components/_scopes/search/Search/Search';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import seo from '@/data/seo';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

import styles from './search.module.scss';

function SearchPage() {
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState();
  const { query } = useRouter();

  const searchTerm = query?.query;

  useEffect(() => {
    setSearch([]);
  }, [query?.query]);

  const handleSearch = useCallback(
    async (endCursor) => {
      if (!searchTerm || !searchTerm?.trim()) return;
      setLoading(true);

      const searchResponse = await getClient().storefront.product.getProducts({
        query: `${searchTerm}*`,
        first: 10,
        after: endCursor || null,
      });

      setLoading(false);

      const { products, pageInfo: pageInfoRes } = searchResponse || {};

      if (products) setSearch((prev) => [...prev, ...products]);
      if (pageInfoRes) setPageInfo(pageInfoRes);
    },
    [searchTerm]
  );

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <PageLayout title={seo.search.title} description={seo.search.description}>
      <PageBanner title={seo.search.title} />
      <Breadcrumbs />
      <Search size="medium" />
      <Container size="medium">
        <div className={styles.search}>
          {loading || search.length > 0 ? (
            <ProductsList
              hasNextPage={pageInfo?.hasNextPage}
              handleNext={() => handleSearch(pageInfo.endCursor)}
              loading={loading}
              layout="grid"
              products={search}
            />
          ) : (
            <EmptyState
              image={notFoundIllustration}
              title="Result Not Found"
              subtitle="Please try again with another keywords or maybe use generic term"
            />
          )}
        </div>
      </Container>
    </PageLayout>
  );
}

export default SearchPage;
