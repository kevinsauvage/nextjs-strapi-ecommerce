import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import useOnScreen from '@/hooks/useOnScreen';
import useRouterFilter from '@/hooks/useRouterFilter';
import useThrottledEffect from '@/hooks/useThrottledEffect';
import Filters from '@/layout/Filters/Filters';
import ListDisplay from '@/layout/ListDisplay/ListDisplay';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import styles from './ProductList.module.scss';
import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';
import Sort from '../Sort/Sort';
import ProductCardRow from '../ProductCardRow/ProductCardRow';

function ProductsList({
  products,
  hasNextPage = true,
  filters,
  actualFilters = [],
}) {
  // States
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState('grid');
  // Hooks
  const router = useRouter();
  const listInnerRef = useRef();
  const isBottom = useOnScreen(listInnerRef);
  const { addParam, addUniqueParam, pushQuery } = useRouterFilter();

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

  // Functions
  const handleChangeFilter = (valueId, filterId) => {
    addParam(filterId, valueId, true, true);
  };

  const handleSort = (e) => {
    handleChangeFilter(e.target.value, 'sort_key', true);
  };

  const handleSetLayout = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <div className={styles.productsList}>
      <Filters
        filters={filters}
        filtersSelected={actualFilters}
        onChange={handleChangeFilter}
        addUniqueParam={addUniqueParam}
      />
      <div className={styles.products}>
        <div className={styles.header}>
          <LayoutButtons handleChange={handleSetLayout} selected={layout} />
          <Sort handleChange={handleSort} />
        </div>
        {Array.isArray(products) && products.length > 0 ? (
          <>
            <ListDisplay layout={layout}>
              {products.map((product) => {
                if (layout === 'grid')
                  return (
                    <ProductCardDefault key={product.id} product={product} />
                  );
                return <ProductCardRow key={product.id} product={product} />;
              })}
            </ListDisplay>
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
