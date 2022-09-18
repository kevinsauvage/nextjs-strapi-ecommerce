import queries from './graphqlQuery';
import { cleanProducts } from './helpers';

const { parseShopifyResponse, apiCallTest } = require('.');

export const getCollectionFilters = async (handle) => {
  const res = await apiCallTest(queries.getCollectionFilters, { handle });
  const parsed = parseShopifyResponse(res);
  return parsed?.collectionByHandle?.products?.filters;
};

export const filterCollection = async (
  handle,
  first = 10,
  filters,
  sort = 'RELEVANCE'
) => {
  const res = await apiCallTest(queries.filterCollection, {
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

export const getProductTags = async () => {
  const res = await apiCallTest(queries.productTags);
  if (res) {
    return res.productTags.edges;
  }
  return [];
};
