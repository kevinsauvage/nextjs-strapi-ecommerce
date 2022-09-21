import { apiCallTest } from '.';
import queries from './graphqlQuery';
import { cleanProducts, cleanVariants } from './helpers';

export const getProductRecommendation = async (productId) => {
  const res = await apiCallTest(queries.queryProductRecommendations, {
    productId,
  });
  if (res && res?.productRecommendations) {
    const cleaned = cleanProducts(res.productRecommendations);
    return cleaned;
  }
  return [];
};

export const getProduct = async (handle) => {
  const res = await apiCallTest(queries.queryProduct, {
    handle,
  });
  if (res && res?.product) {
    return {
      ...res.product,
      variants: cleanVariants(res.product?.variants?.edges),
    };
  }
  return [];
};
