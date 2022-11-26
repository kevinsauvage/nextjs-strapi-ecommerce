import queriesCollection from './collectionQueries';
import { cleanCollections, cleanProducts } from '../helpers';
import shopifyStorefrontCall from '..';

export const filterCollectionForward = async (
  handle,
  first = null,
  filters,
  sort = 'RELEVANCE',
  after = null
) => {
  const res = await shopifyStorefrontCall(
    queriesCollection.filterCollectionForward,
    {
      handle,
      first,
      filters,
      sort,
      after,
    }
  );

  if (res) {
    const products = cleanProducts(res?.collection?.products.edges);
    const pageInfo = res?.collection?.products?.pageInfo;
    const productsFilters = res?.collection?.products?.filters;
    const collection = res?.collection;

    return {
      collection,
      products,
      pageInfo,
      productsFilters,
      seo: res?.collection?.seo,
    };
  }
  return false;
};

export const filterCollectionBackward = async (
  handle,
  last = null,
  filters,
  sort = 'RELEVANCE',
  before = null
) => {
  const res = await shopifyStorefrontCall(
    queriesCollection.filterCollectionBackward,
    {
      handle,
      last,
      filters,
      sort,
      before,
    }
  );

  if (res) {
    const products = cleanProducts(res?.collection?.products.edges);
    const pageInfo = res?.collection?.products?.pageInfo;
    const productsFilters = res?.collection?.products?.filters;
    const collection = res?.collection;

    return {
      collection,
      products,
      pageInfo,
      productsFilters,
      seo: res?.collection?.seo,
    };
  }
  return false;
};

export const getCollections = async (first) => {
  const res = await shopifyStorefrontCall(queriesCollection.getCollections, {
    first,
  });
  if (res) {
    return cleanCollections(res.collections?.edges);
  }
  return [];
};

export const getCollectionsWithProducts = async (first) => {
  const res = await shopifyStorefrontCall(
    queriesCollection.getCollectionsWithProducts,
    {
      first,
    }
  );
  if (res) {
    return cleanCollections(res.collections?.edges);
  }
  return [];
};
