import shopifyStorefrontCall from '..';
import { cleanGraphQLResponse } from '../helpers';
import productQueries from './productQueries';

export const getProductRecommendation = async (productId) => {
  try {
    const res = await shopifyStorefrontCall(productQueries.queryProductRecommendations, { productId });
    return cleanGraphQLResponse(res.data.productRecommendations);
  } catch (error) {
    return console.error(error);
  }
};

export const getProduct = async (handle) => {
  try {
    const res = await shopifyStorefrontCall(productQueries.queryProduct, { handle });

    return cleanGraphQLResponse(res.data.product);
  } catch (error) {
    return console.error(error);
  }
};

export const getProducts = async (sortKey, first) => {
  try {
    const res = await shopifyStorefrontCall(productQueries.queryProducts, { first, sortKey });
    return { products: cleanGraphQLResponse(res?.data?.products) };
  } catch (error) {
    return console.error(error);
  }
};

export const searchProducts = async (query = '', delegateToken, ip, first = 250) => {
  try {
    const res = await shopifyStorefrontCall(
      productQueries.searchProducts,
      {
        query: `title:${query}* OR description:${query}* OR product_type:${query}* OR tag=${query}*`,
        first,
      },
      delegateToken,
      ip
    );

    return cleanGraphQLResponse(res?.data?.products);
  } catch (error) {
    return console.error(error);
  }
};
