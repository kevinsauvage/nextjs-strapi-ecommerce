import { parseCart } from '../helpers';

const { default: shopifyStorefrontCall } = require('..');
const { default: cartQueries } = require('./cartQueries');

export const createCart = async (input) => {
  const res = await shopifyStorefrontCall(cartQueries.queryCreateCart, {
    input,
  });
  return res?.cartCreate?.cart;
};

export const getCartById = async (id) => {
  const res = await shopifyStorefrontCall(cartQueries.queryCartById, {
    id,
  });
  return res?.cart ? parseCart(res?.cart) : {};
};

export const cartBuyerIdentityUpdate = async (cartId, buyerIdentity) => {
  const res = await shopifyStorefrontCall(
    cartQueries.queryAddBuyerIdentityToCart,
    {
      cartId,
      buyerIdentity,
    }
  );
  return res?.cartBuyerIdentityUpdate?.cart
    ? parseCart(res?.cartBuyerIdentityUpdate?.cart)
    : {};
};

export const addLinesToCart = async (cartId, lines) => {
  const res = await shopifyStorefrontCall(cartQueries.queryAddLines, {
    cartId,
    lines,
  });
  return {
    userErrors: res?.userErrors,
    cart: parseCart(res?.cartLinesAdd?.cart),
  };
};

export const removeLinesFromCart = async (cartId, lineIds) => {
  const res = await shopifyStorefrontCall(cartQueries.queryRemoveFromCart, {
    cartId,
    lineIds,
  });

  if (res?.cartLinesRemove) {
    return {
      userErrors: res?.userErrors,
      cart: parseCart(res?.cartLinesRemove?.cart),
    };
  }
  return false;
};

export const updateLines = async (cartId, lines) => {
  const res = await shopifyStorefrontCall(cartQueries.queryUpdateLine, {
    cartId,
    lines,
  });

  if (res?.cartLinesUpdate) {
    return parseCart(res?.cartLinesUpdate?.cart);
  }
  return false;
};
