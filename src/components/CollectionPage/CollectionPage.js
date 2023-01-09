import { useEffect, useState } from 'react';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import Sort from '@/components/_scopes/product/Sort/Sort';
import Pagination from '@/components/_scopes/product/Pagination/Pagination';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import Filters from '@/components/_scopes/collection/Filters/Filters';
import PageLayout from '@/layout/PageLayout/PageLayout';
import style from './CollectionPage.module.scss';

function CollectionPage({ collection, pageInfo: initialPageInfo, filters }) {
  const [layout, setLayout] = useState('grid');

  const {
    handleNext,
    loading,
    handleSort,
    setPageInfo,
    setProducts,
    products,
    setAllFilters,
    pageInfo,
  } = useCollectionContext();

  useEffect(() => {
    if (collection.products) setProducts(collection.products);
    if (initialPageInfo) setPageInfo(initialPageInfo);
    if (filters) setAllFilters(filters);
  }, [
    collection,
    filters,
    initialPageInfo,
    setAllFilters,
    setPageInfo,
    setProducts,
  ]);

  const handleSetLayout = (newLayout) => setLayout(newLayout);

  return (
    <PageLayout title={`${collection?.title}`}>
      <div className={style.CollectionSlugPage}>
        <aside>
          <Filters />
        </aside>
        <main className={style.main}>
          <div className={style.header}>
            <LayoutButtons handleChange={handleSetLayout} selected={layout} />
            <Sort handleChange={handleSort} />
          </div>
          <ProductsList products={products} layout={layout} loading={loading} />
          <Pagination handleNext={handleNext} pageInfo={pageInfo} />
        </main>
      </div>
    </PageLayout>
  );
}

export default CollectionPage;
