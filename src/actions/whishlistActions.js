'use server';

import getClient from '@/shopify';
import { getShopifyToken } from '@/utils/shopify';

const getMetafields = (wishlist, userId) => {
  const metafields = [
    {
      key: 'wishlist',
      namespace: 'custom',
      ownerId: userId,
      type: 'json',
      value: JSON.stringify(wishlist),
    },
  ];

  return { metafields };
};

export const getWishlistAction = async () => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) return [];

  const wishlistResponse = await getClient().storefront.customer.queryCustomerMetafields({
    customerAccessToken: shopifyToken,
    metafields: [{ key: 'wishlist', namespace: 'custom' }],
  });

  if (!wishlistResponse?.length) {
    return [];
  }

  const metafield = wishlistResponse.find((item) => item?.key === 'wishlist')?.value;
  const value = metafield && JSON.parse(metafield);
  return Array.isArray(value) ? value : [value];
};

export const setProductToWishListAction = async (wishlist, product, userId) => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) return;

  const isWishlist = wishlist?.some((production) => production.id === product.id);

  if (isWishlist) {
    return { error: true, message: 'Product already in wishlist' };
  }

  const newWishList = [...wishlist, product];

  const { metafields } = getMetafields(newWishList, userId);

  const responseMetafield = await getClient().admin.customer.metafieldsSet({ metafields });
  const errors = responseMetafield?.userErrors;

  if (errors?.length > 0) {
    console.error(errors);
    return {
      error: true,
      message: 'Something went wrong setting the product to the wishlist',
    };
  }

  const value = responseMetafield?.metafields?.filter((field) => field.key === 'wishlist')?.[0]
    ?.value;

  const parsed = value ? JSON.parse(value) : undefined;

  if (parsed) {
    return {
      message: 'Product correctly added to wishlist',
      responseMetafield: parsed,
      success: true,
    };
  }

  return {
    error: true,
    message: "Couldn't add product to user wishlist",
  };
};

export const removeProductFromWishListAction = async (wishlist, product, userId) => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) return { error: true, message: 'User not logged in' };

  const newWishList = wishlist?.filter((production) => production.id !== product?.id);

  const { metafields } = getMetafields(newWishList, userId);

  const responseMetafield = await getClient().admin.customer.metafieldsSet({ metafields });

  const errors = responseMetafield?.userErrors;

  if (errors?.length > 0) {
    console.error(errors);
    return {
      error: true,
      message: 'Something went wrong removing the product from the wishlist',
    };
  }

  const value = responseMetafield?.metafields?.filter((field) => field.key === 'wishlist')?.[0]
    ?.value;

  const parsed = value ? JSON.parse(value) : undefined;

  if (parsed) {
    return {
      message: 'Product correctly removed from wishlist',
      responseMetafield: parsed,
      success: true,
    };
  }

  return {
    error: true,
    message: 'Something went wrong removing the product from the wishlist',
  };
};
