import ProductCardDefault from '@/components/ProductCardDefault/ProductCardDefault';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import useOnScreen from '@/hooks/useOnScreen';
import useRouterFilter from '@/hooks/useRouterFilter';
import Filters from '../Filters/Filters';
import styles from './ProductList.module.scss';
import Sort from '../Sort/Sort';

function ProductsList({
  products,
  hasNextPage = true,
  filters,
  actualFilters = [],
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const listInnerRef = useRef();
  const isBottom = useOnScreen(listInnerRef);

  const { addParam } = useRouterFilter();

  const handlePushQuery = (query, scroll) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          ...query,
        },
      },
      undefined,
      {
        scroll,
      }
    );
  };

  useEffect(() => {
    if (isBottom && hasNextPage) {
      const newPage = router.query.page ? Number(router.query.page) + 1 : 2;
      handlePushQuery({ page: newPage }, false);
      setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBottom, handlePushQuery]);

  useEffect(() => {
    setLoading(false);
  }, [products]);

  const handleChangeFilter = (value) => {
    const key = Object.keys(value)[0];
    addParam(key, JSON.stringify(value), true, true);
  };

  const handleSort = (e) => {
    handleChangeFilter(e.target.value, 'sort_key', true);
  };

  return (
    <div className={styles.productsList}>
      <Filters
        filters={filters}
        filtersSelected={actualFilters}
        onChange={handleChangeFilter}
      />
      <div className={styles.products}>
        <div className={styles.header}>
          <Sort handleChange={handleSort} />
        </div>
        {Array.isArray(products) && products.length > 0 ? (
          <>
            <ul className={styles.containerGrid}>
              {products.map((product) => (
                <ProductCardDefault key={product.id} product={product} />
              ))}
            </ul>
            <div ref={listInnerRef} />
          </>
        ) : (
          <div className={styles.noResults}>No results</div>
        )}

        {!hasNextPage && products.length > 0 && (
          <div className={styles.noResults}>
            <p>No more results</p>
          </div>
        )}
        <div className={styles.loader}>
          <ClipLoader loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default ProductsList;
