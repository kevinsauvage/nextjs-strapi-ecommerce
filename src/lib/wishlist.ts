import { revalidatePath } from 'next/cache';

import config from '@/config';
import { adminSdk, storefrontSdk } from '@/shopify';
import type { ProductFieldsFragment } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';

export async function requireWishlistAuth() {
  const shopifyToken = await getShopifyToken();
  if (!shopifyToken) {
    throw new Error('User not authenticated');
  }
  return shopifyToken;
}

export const getWishlist = async (): Promise<ProductFieldsFragment[]> => {
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

export const createWishlistMetafields = (
  wishlist: Array<ProductFieldsFragment> | ProductFieldsFragment | undefined,
  userId: string,
) => {
  return {
    metafields: [
      {
        key: 'wishlist',
        namespace: 'custom',
        ownerId: userId,
        type: 'json',
        value: JSON.stringify(wishlist),
      },
    ],
  };
};

export const updateWishlistMetafields = async (
  wishlist: ProductFieldsFragment[],
  userId: string,
): Promise<{ success: boolean; data?: ProductFieldsFragment[]; message?: string }> => {
  const { metafields } = createWishlistMetafields(wishlist, userId);

  const responseMetafield = await adminSdk().MetafieldsSet({ metafields });
  const errors = responseMetafield?.metafieldsSet?.userErrors;

  if (errors && errors.length > 0) {
    console.error('MetafieldsSet errors:', errors);
    return {
      success: false,
      message: 'Something went wrong updating the wishlist',
    };
  }

  const value = responseMetafield?.metafieldsSet?.metafields?.filter(
    (field) => field.key === 'wishlist',
  )?.[0]?.value;

  const parsed = value ? (JSON.parse(value) as ProductFieldsFragment[]) : undefined;

  if (parsed) {
    revalidateWishlist();
    return {
      success: true,
      data: parsed,
    };
  }

  return {
    success: false,
    message: "Couldn't update user wishlist",
  };
};

export function revalidateWishlist(): void {
  revalidatePath(config.routes.wishlist);
  revalidatePath('/', 'layout'); // Also revalidate layout since wishlist is used there
}

export function getWishlistErrorStatus(error: unknown): number {
  if (error instanceof Error) {
    if (error.message === 'User not authenticated') return 401;
    if (error.message.includes('not found')) return 404;
  }
  return 500;
}
