'use server';

import { revalidatePath } from 'next/cache';

import config from '@/config';
import { handleUserErrors } from '@/helpers/shopify';
import { storefrontSdk } from '@/shopify';
import { adjustPaginationVariables } from '@/shopify/helpers';
import type { CartBuyerIdentityInput, GetCustomerQuery } from '@/shopify/storefront';
import { getShopifyCartId } from '@/utils/shopify';

import { getCookieAction, setCookieAction } from './cookiesActions';

const missingCartErrorName = 'Missing cartId cookie. Cart could not be found.';

export const getCartAction = async ({
  first = 10,
  last = 0,
  after = '',
  before = '',
  reverse = false,
}: {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  reverse?: boolean;
}) => {
  const cartId = (await getCookieAction(config.cookies.cartId)) as {
    value: string;
  };

  if (!cartId?.value) {
    throw new Error(missingCartErrorName);
  }

  try {
    const response = await storefrontSdk().getCart({
      cartId: cartId?.value,
      ...adjustPaginationVariables({ after, before, first, last, reverse }),
    });

    const { cart } = response || {};

    if (cart?.id) return response;

    throw new Error('Cart could not be found');
  } catch (error) {
    console.error('Error fetching cart:', JSON.stringify(error, undefined, 2));
    throw new Error('Failed to fetch cart');
  }
};

export const createCartAction = async () => {
  const cartId = await getCookieAction(config.cookies.cartId);

  if (cartId) return;

  try {
    const createCartResponse = await storefrontSdk().cartCreate({
      ...adjustPaginationVariables({ first: 1 }),
    });

    const { cart, userErrors, warnings } = createCartResponse.cartCreate || {};

    if (warnings && Array.isArray(warnings) && warnings?.length) {
      console.warn('Warnings:', warnings);
    }

    if (userErrors && Array.isArray(userErrors) && userErrors?.length) {
      handleUserErrors(userErrors);
    }

    if (cart) {
      await setCookieAction(config.cookies.cartId, cart.id);
      return cart;
    }
  } catch (error) {
    console.error('Error creating cart:', JSON.stringify(error, undefined, 2));
    throw new Error('Failed to create cart');
  }
};

export const updateCartBuyerIdentityAction = async (
  customerAccessToken: string,
  user: GetCustomerQuery['customer'],
  first: number,
  last: number,
  after: string,
  before: string,
) => {
  if (!customerAccessToken) {
    throw new Error('Missing customerAccessToken');
  }

  if (!user) {
    throw new Error('Missing user');
  }

  const cartId = await getShopifyCartId();

  if (!cartId) {
    throw new Error(missingCartErrorName);
  }

  const buyerIdentity = {
    customerAccessToken,
    email: user.email,
    phone: user.phone,
  } as CartBuyerIdentityInput;

  try {
    const updateResponse = await storefrontSdk().cartBuyerIdentityUpdate({
      buyerIdentity,
      cartId,
      ...adjustPaginationVariables({ after, before, first, last }),
    });

    const { cart, userErrors } = updateResponse?.cartBuyerIdentityUpdate || {};

    handleUserErrors(userErrors);

    return cart;
  } catch (error) {
    console.error('Error updating cart buyer identity:', JSON.stringify(error, undefined, 2));
    throw new Error('Failed to update cart buyer identity');
  }
};

export const cartLinesUpdateAction = async (
  lines: {
    id: string;
    quantity: number;
  }[],
  first: number,
  last: number,
  after: string,
  before: string,
) => {
  const cartId = await getShopifyCartId();

  if (!cartId) {
    console.warn(missingCartErrorName);
    throw new Error(missingCartErrorName);
  }

  try {
    const updateLinesResponse = await storefrontSdk().cartLinesUpdate({
      cartId,
      lines,
      ...adjustPaginationVariables({ after, before, first, last }),
    });
    const { cart, userErrors } = updateLinesResponse?.cartLinesUpdate || {};

    handleUserErrors(userErrors);

    if (cart) {
      revalidatePath('/');

      return {
        cart,
        message: 'Cart updated successfully',
        success: true,
      };
    }
  } catch (error) {
    console.error('Error updating cart lines:', JSON.stringify(error, undefined, 2));
    throw new Error('Failed to update cart lines');
  }
};

export const cartLinesAddAction = async (
  lines: Array<{ merchandiseId: string; quantity: number }>,
  first: number,
  last: number,
  after: string,
  before: string,
) => {
  const cartId = await getShopifyCartId();

  if (!cartId) {
    throw new Error(missingCartErrorName);
  }

  try {
    const addLineResponse = await storefrontSdk().cartLinesAdd({
      cartId,
      lines,
      ...adjustPaginationVariables({ after, before, first, last }),
    });

    const { cart, userErrors } = addLineResponse?.cartLinesAdd || {};

    handleUserErrors(userErrors);

    if (cart) {
      revalidatePath('/');

      return {
        cart,
        message: 'Product added successfully',
      };
    }
  } catch (error) {
    console.error('Error adding lines to cart:', JSON.stringify(error, undefined, 2));
    throw new Error('Failed to add lines to cart');
  }
};

export const cartLinesRemoveAction = async (
  lineItemId: string,
  first: number,
  last: number,
  after: string,
  before: string,
) => {
  const cartId = await getShopifyCartId();

  if (!cartId) {
    throw new Error(missingCartErrorName);
  }

  try {
    const removeLinesResponse = await storefrontSdk().cartLinesRemove({
      cartId,
      lineIds: [lineItemId],
      ...adjustPaginationVariables({ after, before, first, last }),
    });

    const { cart, userErrors } = removeLinesResponse?.cartLinesRemove || {};

    handleUserErrors(userErrors);

    if (cart) {
      revalidatePath('/');

      return {
        cart,
        message: 'Product removed successfully',
      };
    }
  } catch (error) {
    console.error('Error removing lines from cart:', JSON.stringify(error, undefined, 2));
    throw new Error('Failed to remove lines from cart');
  }
};
