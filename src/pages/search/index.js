import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import PageLayout from '@/layout/PageLayout/PageLayout';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import Container from '@/components/Container/Container';
import getClient from '@/shopify/index';
import styles from './search.module.scss';

function Search() {
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState();
  const { query } = useRouter();

  const searchTerm = query?.query;

  const handleSearch = useCallback(async () => {
    if (!searchTerm || !searchTerm?.trim()) return;
    setLoading(true);
    const searchResponse = await getClient().product.getProducts({ query: `${searchTerm}*`, first: 10 });
    setLoading(false);

    const { products, pageInfo: pageInfoRes } = searchResponse || {};

    if (products) setSearch(products);
    if (pageInfoRes) setPageInfo(pageInfoRes);
  }, [searchTerm]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <PageLayout title="Search page">
      {loading && <PageLoader />}
      <Container>
        <div className={styles.header}>
          <h1>Search results for: {searchTerm?.toUpperCase()}</h1>
        </div>
        <ProductsList layout="grid" products={search} />
      </Container>
    </PageLayout>
  );
}

export default Search;
