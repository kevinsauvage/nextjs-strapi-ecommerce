import shopifyStorefrontCall from '..';
import {
  cleanCollections,
  cleanImage,
  cleanProducts,
  cleanVariants,
} from '../helpers';
import productQueries from './productQueries';

export const getProductRecommendation = async (productId) => {
  try {
    const res = await shopifyStorefrontCall(
      productQueries.queryProductRecommendations,
      {
        productId,
      }
    );
    const product = res?.data?.productRecommendations;
    if (product) return cleanProducts(product);
    return null;
  } catch (error) {
    return console.error(error);
  }
};

export const getProduct = async (handle) => {
  try {
    const res = await shopifyStorefrontCall(productQueries.queryProduct, {
      handle,
    });
    const product = res?.data?.product;
    if (product) {
      return {
        ...product,
        images: cleanImage(product?.images?.edges),
        variants: cleanVariants(product?.variants?.edges),
      };
    }
    return null;
  } catch (error) {
    return console.error(error);
  }
};

export const getProducts = async (sortKey, first) => {
  try {
    const res = await shopifyStorefrontCall(productQueries.queryProducts, {
      first,
      sortKey,
    });
    const products = res?.data?.products.edges;
    if (products) return { products: cleanProducts(products) };
    return null;
  } catch (error) {
    return console.error(error);
  }
};

export const searchProducts = async (query, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      productQueries.searchProducts,
      {
        query: `title:${query}`,
      },
      delegateToken,
      ip
    );

    console.log(`delegateToken: ${delegateToken}`);
    console.log(`ip: ${ip}`);

    const response = res?.data?.products?.edges;

    if (response) {
      const products = response.map((product) => ({
        ...product.node,
        images: cleanImage(product.node?.images?.edges),
        collections: cleanCollections(product.node?.collections?.edges),
      }));
      console.log(products, 'product');
      return products;
    }
    return null;
  } catch (error) {
    return console.error(error);
  }
};
