import Page from '@/layout/Page/Page';
import ProductsList from '@/components/scopes/product/ProductList/ProductsList';
import { useEffect, useState } from 'react';

import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import Sort from '@/components/scopes/product/Sort/Sort';
import Filters from '@/layout/Filters/Filters';
import Pagination from '@/components/scopes/product/Pagination/Pagination';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import style from './CollectionPage.module.scss';

function CollectionPage({ title, data }) {
  const [layout, setLayout] = useState('grid');
  const [products, setProducts] = useState(data?.products);
  const { collection } = data || {};

  const { handleNext, handlePrev, loading, handleSort, pageInfo } =
    useCollectionContext();

  useEffect(() => {
    setProducts(data?.products);
  }, [data]);

  const handleSetLayout = (newLayout) => setLayout(newLayout);

  return (
    <Page title={`${title}`}>
      <div className={style.banner}>
        <h1 className={style.title}>{collection?.title}</h1>
        <p className={style.description}>{collection?.description}</p>
      </div>
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
          <Pagination
            handleNext={handleNext}
            handlePrev={handlePrev}
            pageInfo={pageInfo}
          />
        </main>
      </div>
    </Page>
  );
}

export default CollectionPage;
