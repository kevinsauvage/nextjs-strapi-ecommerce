import { useEffect, useState } from 'react';
import Page from '@/layout/Page/Page';
import ProductsList from '@/components/scopes/product/ProductList/ProductsList';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import Sort from '@/components/scopes/product/Sort/Sort';
import Filters from '@/layout/Filters/Filters';
import Pagination from '@/components/scopes/product/Pagination/Pagination';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
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
    <Page title={`${collection?.title}`}>
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
    </Page>
  );
}

export default CollectionPage;
