import shopifyStorefrontCall from '..';
import { cleanGraphQLResponse } from '../helpers';
import checkoutQueries from './checkoutQueries';

/**
 * This function associates a customer to a checkout.
 * @param checkoutId - The checkout ID that you want to associate the customer to.
 * @param customerAccessToken - The customer's access token
 * @param delegateAccessToken - The access token for the shopify store
 * @param ip - the IP address of the customer
 * @returns The checkout object.
 */
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

/**
 * It creates a checkout object in Shopify, and returns the checkout object.
 * @param input - { email: string, password: string }
 * @param delegateAccessToken - This is the access token that you get from the Shopify API.
 * @param ip - The IP address of the user.
 * @returns The checkout object.
 */
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

/**
 * It takes a checkout id, a delegate access token, and an ip address, and returns a checkout object
 * @param id - the checkout id
 * @param delegateAccessToken - This is the access token that you get from the Shopify API.
 * @param ip - the IP address of the user
 * @returns The checkout object.
 */
export const getCheckoutById = async (id, delegateAccessToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.queryCheckoutById,
      { id },
      delegateAccessToken,
      ip
    );

    const checkout = cleanGraphQLResponse(res?.data);

    if (checkout) return { checkout: checkout.node };
    return null;
  } catch (e) {
    return console.error(e);
  }
};

/**
 * It takes a checkoutId, lineItems, delegateAccessToken, and ip as arguments and returns a response
 * object with a checkout property.
 * @param checkoutId - The checkout ID that you want to add the line items to.
 * @param lineItems - [{variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yODU2ODgyMDA5MjQ4MQ==",
 * quantity: 1}]
 * @param delegateAccessToken - This is the access token that you get from the Shopify API.
 * @param ip - the ip address of the user
 * @returns The checkout object.
 */
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

/**
 * It takes a checkoutId, lineItemIds, delegateAccessToken, and ip as arguments and returns a checkout
 * object with the line items removed.
 * @param checkoutId - The checkout ID
 * @param lineItemIds - [String]
 * @param delegateAccessToken - This is the access token that you get from the shopify API.
 * @param ip - the ip address of the user
 * @returns The checkout object.
 */
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

/**
 * It takes a checkoutId, lineItems, delegateAccessToken, and ip as arguments and returns a response
 * object with a checkout property.
 * @param checkoutId - The checkout ID
 * @param lineItems - [{
 * @param delegateAccessToken - This is the access token that you get from the Shopify API.
 * @param ip - the ip address of the user
 * @returns The checkout object.
 */
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

    console.log('🚀 ~ file: checkoutApiCall.js:178 ~ res', res);

    const response = res?.data?.checkoutLineItemsUpdate;

    if (response) {
      return {
        ...response,
        checkout: cleanGraphQLResponse(response.checkout),
      };
    }
    return null;
  } catch (e) {
    return console.error(e);
  }
};

export const updateCheckoutShippingAddress = async (
  shippingAddress,
  checkoutId,
  delegateAccessToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      checkoutQueries.updateCheckoutShippingAddress,
      { shippingAddress, checkoutId },
      delegateAccessToken,
      ip
    );

    const response = res?.data?.checkoutShippingAddressUpdateV2;

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
