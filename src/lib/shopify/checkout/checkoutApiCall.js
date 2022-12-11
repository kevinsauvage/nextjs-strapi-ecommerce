import shopifyStorefrontCall from '..';
import { cleanGraphQLResponse } from '../helpers';
import checkoutQueries from './checkoutQueries';

// eslint-disable-next-line import/prefer-default-export
export const associateCustomerToCheckout = async (
  checkoutId,
  customerAccessToken,
  delegateAccessToken,
  ip
) => {
  console.log(
    `--------------SERVER---------------associateCustomerToCheckout with delegateAccessToken: ${delegateAccessToken}  and ip: ${ip}`
  );
  const res = await shopifyStorefrontCall(
    checkoutQueries.queryAddCustomerToCheckout,
    {
      checkoutId,
      customerAccessToken,
    },
    delegateAccessToken
  );
  return {
    checkout: cleanGraphQLResponse(
      res?.data?.checkoutCustomerAssociateV2?.checkout
    ),
  };
};

export const createCheckout = async (input, delegateAccessToken, ip) => {
  console.log(
    `---------------SERVER--------------create checkout with delegateAccessToken: ${delegateAccessToken}  and ip: ${ip}`
  );

  console.log(input, 'input');
  const res = await shopifyStorefrontCall(
    checkoutQueries.queryCreateCheckout,
    {
      input,
    },
    delegateAccessToken,
    ip
  );

  return {
    checkout: cleanGraphQLResponse(res?.data?.checkoutCreate?.checkout),
  };
};

export const getCheckoutById = async (id, delegateAccessToken, ip) => {
  console.log(
    `--------------SERVER---------------get checkout with delegateAccessToken: ${delegateAccessToken}  and ip: ${ip}`
  );
  const res = await shopifyStorefrontCall(checkoutQueries.queryCheckoutById, {
    id,
  });

  return {
    checkout: cleanGraphQLResponse(res?.data?.node),
  };
};

export const addLinesToCheckout = async (
  checkoutId,
  lineItems,
  delegateAccessToken,
  ip
) => {
  console.log(
    `--------------SERVER---------------add line to checkout with delegateAccessToken: ${delegateAccessToken}  and ip: ${ip}`
  );

  const res = await shopifyStorefrontCall(
    checkoutQueries.queryAddLinesItem,
    {
      checkoutId,
      lineItems,
    },
    delegateAccessToken,
    ip
  );

  return {
    ...res?.data?.checkoutLineItemsAdd,
    checkout: cleanGraphQLResponse(res?.data?.checkoutLineItemsAdd?.checkout),
  };
};

export const removeLinesFromCheckout = async (
  checkoutId,
  lineItemIds,
  delegateAccessToken,
  ip
) => {
  console.log(
    `---------------SERVER--------------remove line from  checkout with delegateAccessToken: ${delegateAccessToken}  and ip: ${ip}`
  );

  const res = await shopifyStorefrontCall(
    checkoutQueries.queryRemoveFromCheckout,
    {
      checkoutId,
      lineItemIds,
    },
    delegateAccessToken,
    ip
  );

  if (res?.data?.checkoutLineItemsRemove) {
    return {
      ...res?.data?.checkoutLineItemsRemove,
      checkout: cleanGraphQLResponse(
        res?.data?.checkoutLineItemsRemove?.checkout
      ),
    };
  }
  return false;
};

export const updateLines = async (
  checkoutId,
  lineItems,
  delegateAccessToken,
  ip
) => {
  console.log(
    `-------------SERVER----------------update line to checkout with delegateAccessToken: ${delegateAccessToken}  and ip: ${ip}`
  );

  const res = await shopifyStorefrontCall(
    checkoutQueries.queryUpdateLine,
    {
      checkoutId,
      lineItems,
    },
    delegateAccessToken,
    ip
  );

  if (res?.data?.checkoutLineItemsUpdate) {
    return {
      ...res?.data?.checkoutUserErrors,
      checkout: cleanGraphQLResponse(
        res?.data?.checkoutLineItemsUpdate?.checkout
      ),
    };
  }
  return false;
};
