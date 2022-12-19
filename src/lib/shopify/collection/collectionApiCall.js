import queriesCollection from './collectionQueries';
import { cleanCollections, cleanProducts } from '../helpers';
import shopifyStorefrontCall from '..';

export const filterCollectionForward = async (
  handle,
  first = null,
  filters,
  sort = 'RELEVANCE',
  after = null,
  delegateToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      queriesCollection.filterCollectionForward,
      {
        handle,
        first,
        filters,
        sort,
        after,
      },
      delegateToken,
      ip
    );

    if (res) {
      const products = cleanProducts(res?.data?.collection?.products.edges);
      const pageInfo = res?.data?.collection?.products?.pageInfo;
      const collection = res?.data?.collection;
      const seo = res?.data?.collection?.seo;
      return {
        collection,
        products,
        pageInfo,
        seo,
      };
    }
    return null;
  } catch (e) {
    return console.error(e);
  }
};

export const filterCollectionBackward = async (
  handle,
  last = null,
  filters,
  sort = 'RELEVANCE',
  before = null,
  delegateToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      queriesCollection.filterCollectionBackward,
      {
        handle,
        last,
        filters,
        sort,
        before,
      },
      delegateToken,
      ip
    );

    if (res) {
      const products = cleanProducts(res?.data?.collection?.products.edges);
      const pageInfo = res?.data?.collection?.products?.pageInfo;
      const collection = res?.data?.collection;
      const seo = res?.data?.collection?.seo;

      return {
        collection,
        products,
        pageInfo,
        seo,
      };
    }
    return false;
  } catch (e) {
    return console.error(e);
  }
};

export const getCollections = async (first) => {
  try {
    const res = await shopifyStorefrontCall(queriesCollection.getCollections, {
      first,
    });
    const collections = res.data?.collections?.edges;
    if (collections) return cleanCollections(collections);
    return null;
  } catch (e) {
    return console.error(e);
  }
};

export const getCollectionsWithProducts = async (first) => {
  try {
    const res = await shopifyStorefrontCall(
      queriesCollection.getCollectionsWithProducts,
      { first }
    );
    const collections = res.data?.collections?.edges;
    if (collections) return cleanCollections(collections);
    return null;
  } catch (e) {
    return console.error(e);
  }
};

export const getCollectionFilters = async (handle, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      queriesCollection.getCollectionFilters,
      { handle },
      delegateToken,
      ip
    );
    const filters = res?.data?.collection?.products?.filters;
    if (filters) return filters;
    return null;
  } catch (err) {
    return console.error(err);
  }
};
