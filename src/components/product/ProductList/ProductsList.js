import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import useOnScreen from '@/hooks/useOnScreen';
import useRouterFilter from '@/hooks/useRouterFilter';
import useThrottledEffect from '@/hooks/useThrottledEffect';
import Filters from '@/components/Filters/Filters';
import Sort from '@/components/Sort/Sort';
import styles from './ProductList.module.scss';
import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';

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
  const { addParam, pushQuery } = useRouterFilter();

  useThrottledEffect(
    () => {
      if (isBottom && hasNextPage) {
        setLoading(true);
        const newPage = router.query.page ? Number(router.query.page) + 1 : 2;
        pushQuery({ ...router.query, page: newPage }, false);
      }
    },
    1500,
    [isBottom, pushQuery]
  );

  useEffect(() => {
    setLoading(false);
  }, [products]);

  const handleChangeFilter = (valueId, filterId) => {
    addParam(filterId, valueId, true, true);
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
