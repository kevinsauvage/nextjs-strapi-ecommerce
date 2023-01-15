import queriesCollection from './collectionQueries';
import { cleanGraphQLResponse } from '../helpers';
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

    const collection = res?.data?.collection;

    if (collection) {
      const products = cleanGraphQLResponse(collection?.products);
      const pageInfo = collection?.products?.pageInfo;
      const collectionFilters = collection?.products?.filters;
      return {
        collection: { ...collection, products },
        pageInfo,
        collectionFilters,
      };
    }
    return null;
  } catch (e) {
    return console.error(e);
  }
};

export const getCollections = async (first) => {
  try {
    const res = await shopifyStorefrontCall(queriesCollection.getCollections, { first });

    return cleanGraphQLResponse(res?.data?.collections);
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
    return res?.data?.collection?.products?.filters;
  } catch (err) {
    return console.error(err);
  }
};
