import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import PageLayout from '@/layout/PageLayout/PageLayout';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import Container from '@/components/Container/Container';
import getClient from '@/shopify/index';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Search from '@/components/_scopes/search/Search/Search';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import seo from '@/data/seo';
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
      <PageBanner title="Search" />
      <Breadcrumbs />
      <Search size="medium" />
      <Container size="medium">
        <div className={styles.search}>
          <ProductsList
            hasNextPage={pageInfo?.hasNextPage}
            handleNext={() => handleSearch(pageInfo.endCursor)}
            loading={loading}
            layout="grid"
            products={search}
          />
        </div>
      </Container>
    </PageLayout>
  );
}

export default SearchPage;
