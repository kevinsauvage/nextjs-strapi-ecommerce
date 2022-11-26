/* eslint-disable camelcase */
import Page from '@/layout/Page/Page';
import ProductsList from '@/components/product/ProductList/ProductsList';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useRouterFilter from '@/hooks/useRouterFilter';
import {
  filterCollectionForward,
  filterCollectionBackward,
} from '@/lib/shopify/collection/collectionApiCall';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import Sort from '@/components/product/Sort/Sort';
import Filters from '@/layout/Filters/Filters';
import Pagination from '@/components/product/Pagination/Pagination';
import { getFiltersFromParams } from '@/lib/shopify/helpers';
import style from './CollectionSlug.module.scss';

function CollectionSlugPage({ title, data }) {
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [products, setProducts] = useState(data?.products);
  const [pageInfo, setPageInfo] = useState(data?.pageInfo);
  const [productsFilters, setProductsFilters] = useState(data?.productsFilters);
  const { addUniqueParam, addParam, selectedFilters } = useRouterFilter();
  const { query } = useRouter();
  const { collection } = data || {};

  useEffect(() => {
    if (pageInfo) {
      addUniqueParam('startCursor', pageInfo.startCursor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo]);

  const handleRes = (res) => {
    setProducts(res?.products);
    setPageInfo(res?.pageInfo);
    setProductsFilters(res?.productsFilters);
  };

  const getFilters = () => {
    const filters = { ...query };
    delete filters.collectionSlug;
    delete filters.sort_key;
    delete filters.startCursor;
    return filters;
  };

  const handlePrev = async () => {
    const filters = getFilters();
    setLoading(true);
    setProducts(null);
    window.scrollTo(0, 0);
    const res = await filterCollectionBackward(
      title,
      20,
      filters,
      query.sort_key,
      pageInfo.endCursor
    );
    setLoading(false);
    if (res) handleRes(res);
  };

  const handleNext = async () => {
    const filters = getFilters();
    setLoading(true);
    setProducts(null);
    window.scrollTo(0, 0);
    const res = await filterCollectionForward(
      title,
      20,
      filters,
      query.sort_key,
      pageInfo.startCursor
    );
    setLoading(false);
    if (res) handleRes(res);
  };

  const handleFilter = async () => {
    const filters = getFiltersFromParams(productsFilters, query);

    setLoading(true);
    setProducts(null);
    window.scrollTo(0, 0);
    const res = await filterCollectionForward(
      title,
      20,
      filters,
      query.sort_key,
      null
    );
    setLoading(false);
    if (res) handleRes(res);
  };
  const handleSetLayout = (newLayout) => setLayout(newLayout);

  const handleChangeFilter = (valueId, filterId) => addParam(filterId, valueId);

  const handleSort = (e) => handleChangeFilter(e.target.value, 'sort_key');

  return (
    <Page title={`${title}`}>
      <div>
        <h1>{collection?.title}</h1>
        <p>{collection?.descriptionHtml}</p>
      </div>
      <div className={style.CollectionSlugPage}>
        <aside>
          <Filters
            filters={productsFilters}
            filtersSelected={query}
            onChange={handleChangeFilter}
            addUniqueParam={addUniqueParam}
            selectedFilters={selectedFilters}
            handleFilter={handleFilter}
          />
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

export default CollectionSlugPage;

export async function getServerSideProps({ params, query }) {
  const { collectionSlug } = params || {};

  const filters = { ...query };
  delete filters.collectionSlug;
  delete filters.sort_key;
  delete filters.startCursor;

  const data = await filterCollectionForward(
    collectionSlug,
    20,
    filters,
    query.sort_key
  );

  return {
    props: {
      title: collectionSlug,
      data,
    },
  };
}
