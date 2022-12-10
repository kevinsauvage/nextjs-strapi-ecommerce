import shopifyStorefrontCall from '..';
import { cleanGraphQLResponse } from '../helpers';
import checkoutQueries from './checkoutQueries';

// eslint-disable-next-line import/prefer-default-export
export const associateCustomerToCheckout = async (
  checkoutId,
  customerAccessToken
) => {
  const res = await shopifyStorefrontCall(
    checkoutQueries.queryAddCustomerToCheckout,
    {
      checkoutId,
      customerAccessToken,
    }
  );
  return {
    checkout: cleanGraphQLResponse(
      res?.data?.checkoutCustomerAssociateV2?.checkout
    ),
  };
};

export const createCheckout = async (input = {}) => {
  const res = await shopifyStorefrontCall(checkoutQueries.queryCreateCheckout, {
    input,
  });

  return {
    checkout: cleanGraphQLResponse(res?.data?.checkoutCreate?.checkout),
  };
};

export const getCheckoutById = async (id) => {
  const res = await shopifyStorefrontCall(checkoutQueries.queryCheckoutById, {
    id,
  });

  return {
    checkout: cleanGraphQLResponse(res?.data?.node),
  };
};

export const addLinesToCheckout = async (checkoutId, lineItems) => {
  const res = await shopifyStorefrontCall(checkoutQueries.queryAddLinesItem, {
    checkoutId,
    lineItems,
  });

  return {
    ...res?.data?.checkoutLineItemsAdd,
    checkout: cleanGraphQLResponse(res?.data?.checkoutLineItemsAdd?.checkout),
  };
};

export const removeLinesFromCheckout = async (checkoutId, lineItemIds) => {
  const res = await shopifyStorefrontCall(
    checkoutQueries.queryRemoveFromCheckout,
    {
      checkoutId,
      lineItemIds,
    }
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

export const updateLines = async (checkoutId, lineItems) => {
  const res = await shopifyStorefrontCall(checkoutQueries.queryUpdateLine, {
    checkoutId,
    lineItems,
  });

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
