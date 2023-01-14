import queriesCollection from './collectionQueries';
import {
  cleanCollections,
  cleanGraphQLResponse,
  cleanProducts,
} from '../helpers';
import shopifyStorefrontCall from '..';

/**
 * It takes a collection handle, a first value, a filters object, a sort value, an after value, a
 * delegate token, and an ip address, and returns a collection object with a products array and a
 * pageInfo object.
 * @param handle - the handle of the collection
 * @param [first=null] - The number of products to return.
 * @param filters - [{key: "tag", value: "test"}]
 * @param [sort=RELEVANCE] - 'RELEVANCE'
 * @param [after=null] - String
 * @param delegateToken - This is the token that you get from the Shopify API.
 * @param ip - the ip address of the user
 * @returns collection
 */
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
      const products = cleanProducts(collection?.products.edges);
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

/**
 * It takes a number as an argument, and returns an array of objects.
 * @param first - The number of collections to return.
 * @returns An array of objects.
 */
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

export const getCollectionsMenu = async () => {
  try {
    const res = await shopifyStorefrontCall(
      queriesCollection.getCollectionsMenu
    );

    return cleanGraphQLResponse(res.data);
  } catch (e) {
    return console.error(e);
  }
};

/**
 * It takes a number as an argument, and returns an array of objects.
 * @param first - The number of collections to return.
 * @returns An array of objects.
 */
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

/**
 * It's a function that takes in a handle, a delegate token, and an IP address, and returns a list of
 * filters for a collection
 * @param handle - the handle of the collection you want to get the filters for
 * @param delegateToken - This is the token that you get from the Shopify API.
 * @param ip - the IP address of the user
 * @returns Array of filters
 */
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
