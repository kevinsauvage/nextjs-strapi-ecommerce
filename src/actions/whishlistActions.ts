'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import config from '@/config';
import { adminSdk, storefrontSdk } from '@/shopify';
import type { ProductFieldsFragment } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';

const getMetafields = (
  wishlist: Array<ProductFieldsFragment> | ProductFieldsFragment | undefined,
  userId: string,
) => {
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

export const setProductToWishListAction = async (
  wishlist: Array<ProductFieldsFragment>,
  product: ProductFieldsFragment,
  userId: string,
) => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) {
    redirect(config.routes.login);
  }

  const isWishlist = wishlist?.some((production) => production.id === product.id);

  if (isWishlist) {
    return { error: true, message: 'Product already in wishlist' };
  }

  const newWishList = [...wishlist, product];

  const { metafields } = getMetafields(newWishList, userId);

  const responseMetafield = await adminSdk().MetafieldsSet({ metafields });
  const errors = responseMetafield?.metafieldsSet?.userErrors;

  if (errors && errors?.length > 0) {
    console.error(errors);
    return {
      error: true,
      message: 'Something went wrong setting the product to the wishlist',
    };
  }

  const value = responseMetafield?.metafieldsSet?.metafields?.filter(
    (field) => field.key === 'wishlist',
  )?.[0]?.value;

  const parsed = value ? (JSON.parse(value) as ProductFieldsFragment[]) : undefined;

  if (parsed) {
    revalidatePath('/', 'layout');
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

export const removeProductFromWishListAction = async (
  wishlist: Array<ProductFieldsFragment>,
  product: ProductFieldsFragment,
  userId: string,
) => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) return { error: true, message: 'User not logged in' };

  const newWishList = wishlist?.filter((production) => production.id !== product?.id);

  const { metafields } = getMetafields(newWishList, userId);

  const responseMetafield = await adminSdk().MetafieldsSet({ metafields });

  const errors = responseMetafield?.metafieldsSet?.userErrors;

  if (errors && errors.length > 0) {
    console.error(errors);
    return {
      error: true,
      message: 'Something went wrong removing the product from the wishlist',
    };
  }

  const value = responseMetafield?.metafieldsSet?.metafields?.filter(
    (field) => field.key === 'wishlist',
  )?.[0]?.value;

  const parsed = value ? (JSON.parse(value) as ProductFieldsFragment[]) : undefined;

  if (parsed) {
    revalidatePath('/', 'layout');
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

export const getWishlistAction = async (): Promise<ProductFieldsFragment[]> => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) return [];

  const wishlistResponse = await storefrontSdk().getCustomerMetafields({
    customerAccessToken: shopifyToken,
    metafields: [{ key: 'wishlist', namespace: 'custom' }],
  });

  const metafields = wishlistResponse?.customer?.metafields;
  const wishlist = metafields?.[0]?.value;

  if (typeof wishlist === 'string') {
    return JSON.parse(wishlist) as ProductFieldsFragment[];
  }
  return [];
};
