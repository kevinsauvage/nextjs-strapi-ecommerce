import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import PageLayout from '@/layout/PageLayout/PageLayout';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import Container from '@/components/Container/Container';
import getClient from '@/shopify/index';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Button from '@/components/Button/Button';
import styles from './search.module.scss';

function Search() {
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

      console.log('🚀 ~ file: index.js:27 ~ searchResponse ~ searchResponse:', searchResponse);

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
    <PageLayout title="Search page">
      <Breadcrumbs />
      {!loading && (
        <div className={styles.header}>
          <Container>
            <h1>Search results for: {searchTerm?.toUpperCase()}</h1>
          </Container>
        </div>
      )}
      <Container>
        <div className={styles.search}>
          <ProductsList loading={loading} layout="grid" products={search} />
          {pageInfo?.hasNextPage && (
            <div>
              <Button primary onClick={() => handleSearch(pageInfo.endCursor)}>
                Next
              </Button>
            </div>
          )}
        </div>
      </Container>
    </PageLayout>
  );
}

export default Search;
