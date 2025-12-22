import { handleUserErrors } from '@/helpers/shopify';
import { storefrontSdk } from '@/shopify';
import { adjustPaginationVariables } from '@/shopify/helpers';
import type { CartFieldsFragment } from '@/shopify/storefront';

export async function getCart(cartId: string): Promise<CartFieldsFragment | null> {
  try {
    const response = await storefrontSdk('no-store').getCart({
      cartId,
      ...adjustPaginationVariables({ first: 100 }),
    });

    return response?.cart || null;
  } catch (error) {
    console.error('getCart error:', error);
    return null;
  }
}

export async function createCart(): Promise<CartFieldsFragment> {
  const createCartResponse = await storefrontSdk('no-store').cartCreate({
    ...adjustPaginationVariables({ first: 100 }),
  });

  const { cart, userErrors, warnings } = createCartResponse.cartCreate || {};

  if (warnings && Array.isArray(warnings) && warnings?.length) {
    console.warn('Cart creation warnings:', warnings);
  }

  const userErrorResult = handleUserErrors(userErrors);
  if (userErrorResult) {
    console.error('Cart creation user errors:', userErrorResult.userErrors);
    if (!cart?.id) {
      throw new Error(
        userErrorResult.userErrors[0]?.message || 'Failed to create cart due to validation errors',
      );
    }
  }

  if (!cart?.id) {
    throw new Error('Failed to create cart');
  }

  return cart;
}
