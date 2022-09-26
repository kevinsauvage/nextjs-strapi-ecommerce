import queriesCollection from './collectionQueries';
import {
  cleanCollections,
  cleanProducts,
  parseShopifyResponse,
} from '../helpers';
import shopifyStorefrontCall from '..';

export const getCollectionFilters = async (handle) => {
  const res = await shopifyStorefrontCall(
    queriesCollection.getCollectionFilters,
    {
      handle,
    }
  );
  const parsed = parseShopifyResponse(res);
  return parsed?.collectionByHandle?.products?.filters;
};

export const filterCollection = async (
  handle,
  first = 10,
  filters,
  sort = 'RELEVANCE'
) => {
  const res = await shopifyStorefrontCall(queriesCollection.filterCollection, {
    handle,
    first,
    filters,
    sort,
  });

  if (res) {
    const products = cleanProducts(res?.collection?.products.edges);
    const pageInfo = res?.collection?.products?.pageInfo;

    return {
      products,
      pageInfo,
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
