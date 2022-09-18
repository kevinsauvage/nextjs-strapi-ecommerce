import { apiCallTest } from '.';
import queries from './graphqlQuery';
import { cleanProducts } from './helpers';

// eslint-disable-next-line import/prefer-default-export
export const getProductRecommendation = async (productId) => {
  const res = await apiCallTest(queries.queryProductRecommendations, {
    productId,
  });
  if (res && res?.productRecommendations) {
    const cleaned = cleanProducts(res.productRecommendations);
    console.log(cleaned);
    return cleaned;
  }
  return [];
};
