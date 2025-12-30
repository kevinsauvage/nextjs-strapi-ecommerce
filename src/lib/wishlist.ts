import { revalidatePath } from 'next/cache';

import config from '@/config';
import { adminSdk, storefrontSdk } from '@/shopify';
import type { ProductFieldsFragment } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';

export const WISHLIST_MAX_ITEMS = 100;

export type WishlistIds = string[];

export async function requireWishlistAuth() {
  const shopifyToken = await getShopifyToken();
  if (!shopifyToken) {
    throw new Error('User not authenticated');
  }
  return shopifyToken;
}

/**
 * Get wishlist product IDs from metafield
 */
export const getWishlistIds = async (): Promise<WishlistIds> => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) return [];

  const wishlistResponse = await storefrontSdk('no-store').getCustomerMetafields({
    customerAccessToken: shopifyToken,
    metafields: [{ key: 'wishlist', namespace: 'custom' }],
  });

  const metafields = wishlistResponse?.customer?.metafields;
  const wishlistValue = metafields?.[0]?.value;

  if (typeof wishlistValue === 'string') {
    try {
      const parsed = JSON.parse(wishlistValue);
      
      if (Array.isArray(parsed)) {
        return parsed.filter((id): id is string => typeof id === 'string');
      }
    } catch (error) {
      console.error('Error parsing wishlist:', error);
      return [];
    }
  }

  return [];
};

/**
 * Resolve product IDs to full product fragments
 * Fetches products from Shopify using their IDs via the nodes query
 */
const resolveProductsByIds = async (productIds: string[]): Promise<ProductFieldsFragment[]> => {
  if (productIds.length === 0) return [];

  try {
    const response = await storefrontSdk('no-store').getProductsByIds({
      ids: productIds,
      identifiers: [],
    });

    if (!response.nodes || response.nodes.length === 0) {
      return [];
    }

    // Since we use `... on Product` in the query, all non-null nodes are Products
    // Filter out null values and cast to ProductFieldsFragment
    const productMap = new Map(
      response.nodes
        .filter((node) => node !== null && node !== undefined)
        .map((node) => {
          // TypeScript sees this as a union, but we know it's a Product due to `... on Product`
          // Cast directly since the query guarantees it's a Product
          const product = node as unknown as ProductFieldsFragment;
          return [product.id, product] as [string, ProductFieldsFragment];
        }),
    );
    
    // Maintain order based on input IDs
    return productIds
      .map((id) => productMap.get(id))
      .filter((p): p is ProductFieldsFragment => p !== undefined);
  } catch (error) {
    console.error('Error resolving wishlist products:', error);
    return [];
  }
};

/**
 * Get wishlist with resolved product data
 * This is the main function to use when you need full product information
 */
export const getWishlist = async (): Promise<ProductFieldsFragment[]> => {
  const productIds = await getWishlistIds();
  return resolveProductsByIds(productIds);
};

/**
 * Create metafield payload for wishlist (stores only product IDs)
 */
export const createWishlistMetafields = (
  productIds: WishlistIds,
  userId: string,
) => {
  const limitedIds = productIds.slice(0, WISHLIST_MAX_ITEMS);
  
  return {
    metafields: [
      {
        key: 'wishlist',
        namespace: 'custom',
        ownerId: userId,
        type: 'json',
        value: JSON.stringify(limitedIds),
      },
    ],
  };
};

/**
 * Update wishlist metafield with product IDs
 * Returns the updated list of product IDs
 */
export const updateWishlistMetafields = async (
  productIds: WishlistIds,
  userId: string,
): Promise<{ success: boolean; data?: WishlistIds; message?: string }> => {
  const limitedIds = productIds.slice(0, WISHLIST_MAX_ITEMS);
  
  const uniqueIds = Array.from(new Set(limitedIds));

  const { metafields } = createWishlistMetafields(uniqueIds, userId);

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

  if (value) {
    try {
      const parsed = JSON.parse(value) as WishlistIds;
      revalidateWishlist();
      return {
        success: true,
        data: parsed,
      };
    } catch (error) {
      console.error('Error parsing wishlist response:', error);
      return {
        success: false,
        message: "Couldn't parse wishlist response",
      };
    }
  }

  return {
    success: false,
    message: "Couldn't update user wishlist",
  };
};

export function revalidateWishlist(): void {
  revalidatePath(config.routes.wishlist);
  revalidatePath('/', 'layout');
}

export function getWishlistErrorStatus(error: unknown): number {
  if (error instanceof Error) {
    if (error.message === 'User not authenticated') return 401;
    if (error.message.includes('not found')) return 404;
  }
  return 500;
}
