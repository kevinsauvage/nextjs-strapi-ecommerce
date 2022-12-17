import shopifyStorefrontCall from '..';
import { cleanGraphQLResponse } from '../helpers';
import checkoutQueries from './checkoutQueries';

export const associateCustomerToCheckout = async (
  checkoutId,
  customerAccessToken,
  delegateAccessToken,
  ip
) => {
  const res = await shopifyStorefrontCall(
    checkoutQueries.queryAddCustomerToCheckout,
    { checkoutId, customerAccessToken },
    delegateAccessToken,
    ip
  );

  const checkout = res?.data?.checkoutCustomerAssociateV2?.checkout;
  if (checkout) return { checkout: cleanGraphQLResponse(checkout) };
  return null;
};

export const createCheckout = async (input, delegateAccessToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryCreateCheckout,
      { input },
      delegateAccessToken,
      ip
    );

    const checkout = res?.data?.checkoutCreate?.checkout;

    if (checkout) return { checkout: cleanGraphQLResponse(checkout) };
    return null;
  } catch (e) {
    return console.error(e);
  }
};

export const getCheckoutById = async (id, delegateAccessToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryCheckoutById,
      { id },
      delegateAccessToken,
      ip
    );

    const checkout = res?.data?.node;

    if (checkout) return { checkout: cleanGraphQLResponse(checkout) };
    return null;
  } catch (e) {
    return console.error(e);
  }
};

export const addLinesToCheckout = async (
  checkoutId,
  lineItems,
  delegateAccessToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryAddLinesItem,
      { checkoutId, lineItems },
      delegateAccessToken,
      ip
    );
    const response = res?.data?.checkoutLineItemsAdd;

    if (response) {
      return {
        ...response,
        checkout: cleanGraphQLResponse(response?.checkout),
      };
    }
    return null;
  } catch (e) {
    return console.error(e);
  }
};

export const removeLinesFromCheckout = async (
  checkoutId,
  lineItemIds,
  delegateAccessToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryRemoveFromCheckout,
      { checkoutId, lineItemIds },
      delegateAccessToken,
      ip
    );

    const data = res?.data?.checkoutLineItemsRemove;

    if (data) {
      return {
        ...data,
        checkout: cleanGraphQLResponse(data?.checkout),
      };
    }
    return null;
  } catch (e) {
    return console.error(e);
  }
};

export const updateLines = async (
  checkoutId,
  lineItems,
  delegateAccessToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryUpdateLine,
      { checkoutId, lineItems },
      delegateAccessToken,
      ip
    );

    const response = res?.data?.checkoutLineItemsUpdate;

    if (response) {
      return {
        ...res?.data?.checkoutLineItemsUpdate,
        checkout: cleanGraphQLResponse(response?.checkout),
      };
    }
    return null;
  } catch (e) {
    return console.error(e);
  }
};
