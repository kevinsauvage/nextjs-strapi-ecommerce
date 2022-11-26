import { parseCart } from '../helpers';

const { default: shopifyStorefrontCall } = require('..');
const { default: cartQueries } = require('./cartQueries');

export const createCart = async (input) => {
  const res = await shopifyStorefrontCall(cartQueries.queryCreateCart, {
    input,
  });
  return res?.data?.cartCreate?.cart;
};

export const getCartById = async (id) => {
  const res = await shopifyStorefrontCall(cartQueries.queryCartById, {
    id,
  });
  return res?.data?.cart ? parseCart(res?.data?.cart) : {};
};

export const cartBuyerIdentityUpdate = async (cartId, buyerIdentity) => {
  const res = await shopifyStorefrontCall(
    cartQueries.queryAddBuyerIdentityToCart,
    {
      cartId,
      buyerIdentity,
    }
  );
  return res?.data?.cartBuyerIdentityUpdate?.cart
    ? parseCart(res?.data?.cartBuyerIdentityUpdate?.cart)
    : {};
};

export const addLinesToCart = async (cartId, lines) => {
  const res = await shopifyStorefrontCall(cartQueries.queryAddLines, {
    cartId,
    lines,
  });
  return {
    userErrors: res?.data?.userErrors,
    cart: parseCart(res?.data?.cartLinesAdd?.cart),
  };
};

export const removeLinesFromCart = async (cartId, lineIds) => {
  const res = await shopifyStorefrontCall(cartQueries.queryRemoveFromCart, {
    cartId,
    lineIds,
  });

  if (res?.data?.cartLinesRemove) {
    return {
      userErrors: res?.data?.userErrors,
      cart: parseCart(res?.data?.cartLinesRemove?.cart),
    };
  }
  return false;
};

export const updateLines = async (cartId, lines) => {
  const res = await shopifyStorefrontCall(cartQueries.queryUpdateLine, {
    cartId,
    lines,
  });

  if (res?.data?.cartLinesUpdate) {
    return parseCart(res?.data?.cartLinesUpdate?.cart);
  }
  return false;
};
