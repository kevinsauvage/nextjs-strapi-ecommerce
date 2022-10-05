import shopifyStorefrontCall from '..';
import { cleanProducts, cleanVariants } from '../helpers';
import productQueries from './productQueries';

export const getProductTags = async () => {
  const res = await shopifyStorefrontCall(productQueries.productTags);
  if (res) {
    return res.productTags.edges;
  }
  return [];
};

export const getProductRecommendation = async (productId) => {
  const res = await shopifyStorefrontCall(
    productQueries.queryProductRecommendations,
    {
      productId,
    }
  );
  if (res && res?.productRecommendations) {
    const cleaned = cleanProducts(res.productRecommendations);
    return cleaned;
  }
  return [];
};

export const getProduct = async (handle) => {
  const res = await shopifyStorefrontCall(productQueries.queryProduct, {
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

export const getProducts = async (sortKey, first) => {
  const res = await shopifyStorefrontCall(productQueries.queryProducts, {
    first,
    sortKey,
  });

  if (res && res?.products) {
    return {
      products: cleanProducts(res.products.edges),
    };
  }
  return [];
};

export const getProductVariant = async (handle, input = []) => {
  const res = await shopifyStorefrontCall(productQueries.queryProductVariant, {
    handle,
    input,
  });

  return res?.product?.variantBySelectedOptions;
};
