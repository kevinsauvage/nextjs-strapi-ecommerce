import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import PageLayout from '@/layout/PageLayout/PageLayout';
import nextApiCall from '@/utils/apiNext';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import styles from './search.module.scss';

function Search() {
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query } = useRouter();

  const searchTerm = query?.query;

  const handleSearch = useCallback(async () => {
    if (!searchTerm || !searchTerm?.trim()) return;
    setLoading(true);
    const response = await nextApiCall.searchProducts(searchTerm);
    setLoading(false);
    setSearch(response);
  }, [searchTerm]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <PageLayout title="Search page">
      {loading && <PageLoader />}
      <div className={styles.header}>
        <h1>Search results for: {searchTerm?.toUpperCase()}</h1>
      </div>
      <ProductsList layout="grid" products={search} />
    </PageLayout>
  );
}

export default Search;
