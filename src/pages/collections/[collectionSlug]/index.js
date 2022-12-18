import Page from '@/layout/Page/Page';
import ProductsList from '@/components/scopes/product/ProductList/ProductsList';
import { useEffect, useState } from 'react';
import useRouterFilter from '@/hooks/useRouterFilter';
import {
  filterCollectionForward,
  filterCollectionBackward,
  getCollectionFilters,
} from '@/lib/shopify/collection/collectionApiCall';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import Sort from '@/components/scopes/product/Sort/Sort';
import Filters from '@/layout/Filters/Filters';
import Pagination from '@/components/scopes/product/Pagination/Pagination';
import { getFiltersFromQuery } from '@/lib/shopify/helpers';
import nookies from 'nookies';
import style from './CollectionSlug.module.scss';

function CollectionSlugPage({ title, data, filters }) {
  const [layout, setLayout] = useState('grid');
  const [products, setProducts] = useState();
  const [pageInfo, setPageInfo] = useState();
  const [productsFilters, setProductFilters] = useState([]);
  const { collection } = data || {};

  const {
    applyFilters,
    selectedFilters,
    addFilter,
    removeFilter,
    handleNext,
    handlePrev,
    loading,
    handleSort,
    resetFilters,
    notAppliedFilters,
    actualFilters,
    isSelectionDifferent,
  } = useRouterFilter(filters, pageInfo);

  useEffect(() => {
    setProducts(data?.products);
    setPageInfo(data?.pageInfo);
    setProductFilters(data?.productsFilters);
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
          <Filters
            filters={productsFilters}
            applyFilters={applyFilters}
            selectedFilters={selectedFilters}
            addFilter={addFilter}
            removeFilter={removeFilter}
            resetFilters={resetFilters}
            notAppliedFilters={notAppliedFilters}
            actualFilters={actualFilters}
            isSelectionDifferent={isSelectionDifferent}
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

export async function getServerSideProps(ctx) {
  const { params, query, req } = ctx;
  const { collectionSlug } = params || {};
  const cookies = nookies.get(ctx);
  const delegateToken = cookies?.shopifyDelegateToken;
  const forwarded = req.headers['x-forwarded-for'];

  const ip =
    typeof forwarded === 'string'
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress;

  const allFilters = await getCollectionFilters(
    collectionSlug,
    delegateToken,
    ip
  );

  const filteredFilters = getFiltersFromQuery(allFilters, query);
  const filters = filteredFilters.map((item) => JSON.parse(item.input));

  let data;

  if (query.direction === 'backward') {
    data = await filterCollectionBackward(
      collectionSlug,
      20,
      filters,
      query.sort_key,
      query.startCursor,
      delegateToken,
      ip
    );
  } else {
    data = await filterCollectionForward(
      collectionSlug,
      20,
      filters,
      query.sort_key,
      query.endCursor,
      delegateToken,
      ip
    );
  }

  return {
    props: {
      title: collectionSlug,
      data,
      filters: allFilters,
    },
  };
}
