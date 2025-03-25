/* eslint-disable sonarjs/no-duplicate-string */
'use server';

import { revalidatePath } from 'next/cache';

import config from '@/config';
import getClient from '@/shopify';
import { getShopifyCartId } from '@/utils/shopify';

import { getCookieAction, setCookieAction } from './cookiesActions';

export const getCartAction = async () => {
  const cartId = await getCookieAction(config.cookies.cartId);

  if (!cartId?.value) {
    return;
  }

  const getCartResponse = await getClient().storefront.cart.cartQuery({ cartId: cartId?.value });
  if (getCartResponse?.id) return getCartResponse;
};

export const createCartAction = async () => {
  const cartId = await getCookieAction(config.cookies.cartId);

  if (cartId) return;

  const createCartResponse = await getClient().storefront.cart.cartCreate({ input: {} });

  if (createCartResponse?.cart?.id) {
    setCookieAction(config.cookies.cartId, createCartResponse.cart.id);
    return createCartResponse.cart;
  }
};

export const updateCartBuyerIdentityAction = async (customerAccessToken, user) => {
  if (!customerAccessToken) return console.warn('Missing customerAccessToken');

  const cartId = await getShopifyCartId();

  if (!cartId) {
    return {
      error: true,
      message: 'Missing cart',
    };
  }

  const buyerIdentity = {
    customerAccessToken,
    email: user.email,
  };

  const updateResponse = await getClient().storefront.cart.cartBuyerIdentityUpdate({
    buyerIdentity,
    cartId,
  });

  if (updateResponse?.userErrors) return updateResponse.userErrors;
  if (updateResponse?.cart) return updateResponse.cart;
};

export const cartLinesUpdateAction = async (lines) => {
  const cartId = await getShopifyCartId();

  if (!cartId) {
    return {
      error: true,
      message: 'Missing cart',
    };
  }
  const updateLinesResponse = await getClient().storefront.cart.cartLinesUpdate({
    cartId,
    lines,
  });

  const { cart, userErrors } = updateLinesResponse || {};

  if (cart) {
    revalidatePath('/');

    return {
      cart,
      message: 'Cart updated successfully',
      success: true,
    };
  }

  if (userErrors?.length) {
    return {
      error: true,
      message: userErrors[0],
    };
  }

  return {
    error: true,
    message: 'Error updating cart',
  };
};

export const cartLinesAddAction = async (lines) => {
  const cartId = await getShopifyCartId();

  if (!cartId) {
    return {
      error: true,
      message: 'Missing cart',
    };
  }
  const addLineResponse = await getClient().storefront.cart.cartLinesAdd({
    cartId,
    lines,
  });

  const { cart, userErrors } = addLineResponse;

  if (cart) {
    revalidatePath('/');

    return {
      cart,
      message: 'Product added successfully',
      success: true,
    };
  }
  if (userErrors?.length) {
    return {
      error: true,
      message: userErrors[0],
    };
  }

  return {
    error: true,
    message: 'Error adding product to cart',
  };
};

export const cartLinesRemoveAction = async (lineItemId) => {
  const cartId = await getShopifyCartId();

  if (!cartId) {
    return {
      error: true,
      message: 'Missing cart',
    };
  }

  const removeLinesResponse = await getClient().storefront.cart.cartLinesRemove({
    cartId,
    lines: [lineItemId],
  });

  const { cart, userErrors } = removeLinesResponse;

  if (cart) {
    revalidatePath('/');

    return {
      cart,
      message: 'Product removed successfully',
      success: true,
    };
  }

  if (userErrors?.length) {
    return {
      error: true,
      message: userErrors[0],
    };
  }

  return {
    error: true,
    message: 'Error removing product from cart',
  };
};
