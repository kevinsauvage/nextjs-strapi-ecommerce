import queries from './graphqlQuery';

const { parseShopifyResponse, apiCallTest } = require('.');

const cleanProducts = (prod) => {
  const products = prod.edges.map((product) => ({
    ...product.node,
    images: product.node.images.edges[0].node,
    variants: product.node.variants.edges.map((variant) => ({
      ...variant.node,
    })),
  }));
  return products;
};

export const getCollectionFilters = async (handle) => {
  const res = await apiCallTest(queries.getCollectionFilters, { handle });
  const parsed = parseShopifyResponse(res);
  return parsed?.collectionByHandle?.products?.filters;
};

export const filterCollection = async (handle, first = 10, filters) => {
  const res = await apiCallTest(queries.filterCollection, {
    handle,
    first,
    filters,
  });

  if (res) {
    const products = cleanProducts(res?.collection?.products);
    const pageInfo = res?.collection?.products?.pageInfo;

    return { products, pageInfo };
  }
  return false;
};
