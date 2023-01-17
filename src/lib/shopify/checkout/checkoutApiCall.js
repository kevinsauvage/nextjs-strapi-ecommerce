import shopifyStorefrontCall from '..';
import { cleanGraphQLResponse } from '../helpers';
import checkoutQueries from './checkoutQueries';

export const associateCustomerToCheckout = async (
  checkoutId,
  customerAccessToken,
  delegateAccessToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryAddCustomerToCheckout,
      { checkoutId, customerAccessToken },
      delegateAccessToken,
      ip
    );

    return cleanGraphQLResponse(res?.data?.checkoutCustomerAssociateV2?.checkout);
  } catch (error) {
    return console.error(error);
  }
};

export const createCheckout = async (input, delegateAccessToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryCreateCheckout,
      { input },
      delegateAccessToken,
      ip
    );

    return cleanGraphQLResponse(res?.data?.checkoutCreate?.checkout);
  } catch (error) {
    return console.error(error);
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
    return cleanGraphQLResponse(res?.data?.node);
  } catch (error) {
    return console.error(error);
  }
};

export const addLinesToCheckout = async (checkoutId, lineItems, delegateAccessToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryAddLinesItem,
      { checkoutId, lineItems },
      delegateAccessToken,
      ip
    );
    return cleanGraphQLResponse(res?.data?.checkoutLineItemsAdd?.checkout);
  } catch (error) {
    return console.error(error);
  }
};

export const removeLinesFromCheckout = async (checkoutId, lineItemIds, delegateAccessToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryRemoveFromCheckout,
      { checkoutId, lineItemIds },
      delegateAccessToken,
      ip
    );

    return cleanGraphQLResponse(res?.data?.checkoutLineItemsRemove?.checkout);
  } catch (error) {
    return console.error(error);
  }
};

export const updateLines = async (checkoutId, lineItems, delegateAccessToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryUpdateLine,
      { checkoutId, lineItems },
      delegateAccessToken,
      ip
    );

    return cleanGraphQLResponse(res?.data?.checkoutLineItemsUpdate?.checkout);
  } catch (error) {
    return console.error(error);
  }
};

export const updateCheckoutShippingAddress = async (shippingAddress, checkoutId, delegateAccessToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.updateCheckoutShippingAddress,
      { shippingAddress, checkoutId },
      delegateAccessToken,
      ip
    );

    return cleanGraphQLResponse(res?.data?.checkoutShippingAddressUpdateV2?.checkout);
  } catch (error) {
    return console.error(error);
  }
};
