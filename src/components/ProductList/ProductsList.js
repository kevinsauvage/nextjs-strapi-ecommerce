import ProductCardDefault from '@/components/ProductCardDefault/ProductCardDefault';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import useOnScreen from '@/hooks/useOnScreen';
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

  const handlePushQuery = useCallback((query, scroll) => {
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
  }, []);

  useEffect(() => {
    if (isBottom && hasNextPage) {
      const newPage = router.query.page ? Number(router.query.page) + 1 : 2;
      handlePushQuery({ page: newPage }, false);
      setLoading(true);
    }
  }, [isBottom, handlePushQuery]);

  useEffect(() => {
    setLoading(false);
  }, [products]);

  const handleChangeFilter = (value, key, unique) => {
    const actualValue = actualFilters[key];
    // Set query and return if key doesn't exist in filters

    if (!actualValue || unique)
      return handlePushQuery({ ...{ [key]: value }, page: 1 }, true);
    console.log(actualValue);

    const actualValueArray = Array.isArray(actualValue)
      ? actualValue
      : actualValue.split(',');

    const isIncluded = actualValueArray.includes(value);

    console.log(isIncluded, 'isIncluded');

    // check If key is present in URL
    if (isIncluded) {
      console.log('remove filter');

      const newValueArray = actualValueArray.filter((item) => item !== value);

      return handlePushQuery({ page: 1, [key]: newValueArray }, true);
    }
    return handlePushQuery(
      { page: 1, [key]: [...actualValueArray, value] },
      true
    );
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
        <Sort handleChange={handleSort} />
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
