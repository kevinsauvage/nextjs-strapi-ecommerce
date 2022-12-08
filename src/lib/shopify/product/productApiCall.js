import shopifyStorefrontCall from '..';
import { cleanImage, cleanProducts, cleanVariants } from '../helpers';
import productQueries from './productQueries';

export const getProductRecommendation = async (productId) => {
  const res = await shopifyStorefrontCall(
    productQueries.queryProductRecommendations,
    {
      productId,
    }
  );
  if (res && res?.data?.productRecommendations) {
    const cleaned = cleanProducts(res?.data?.productRecommendations);
    return cleaned;
  }
  return [];
};

export const getProduct = async (handle) => {
  const res = await shopifyStorefrontCall(productQueries.queryProduct, {
    handle,
  });
  if (res && res?.data?.product) {
    return {
      ...res?.data?.product,
      images: cleanImage(res?.data?.product?.images?.edges),
      variants: cleanVariants(res?.data?.product?.variants?.edges),
    };
  }
  return [];
};

export const getProducts = async (sortKey, first) => {
  const res = await shopifyStorefrontCall(productQueries.queryProducts, {
    first,
    sortKey,
  });

  if (res && res?.data?.products) {
    return {
      products: cleanProducts(res?.data?.products.edges),
    };
  }
  return [];
};
