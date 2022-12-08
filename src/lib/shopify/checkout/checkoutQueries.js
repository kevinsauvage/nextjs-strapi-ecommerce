import { checkoutFragment } from '../fragment';

const queryCreateCheckout = `mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        ${checkoutFragment}
      }
      checkoutUserErrors {
        message
      }
    }
  }`;

const queryAddLinesItem = `mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
  checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
    checkout {
      ${checkoutFragment}
    }
    checkoutUserErrors {
      message
    }
  }
}`;

const queryAddCustomerToCheckout = `mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
  checkoutCustomerAssociateV2(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
    checkout {
      ${checkoutFragment}
    }
    checkoutUserErrors {
      message
    }
  }
}`;

const queryCheckoutById = `query($id: ID!) {
  node(id:$id) {
    id
    ... on Checkout {
      ${checkoutFragment}
    }
  }
}`;

const queryRemoveFromCheckout = `mutation checkoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
  checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
    checkout {
      ${checkoutFragment}
    }
    checkoutUserErrors {
      message
    }
  }
}`;

const queryUpdateLine = `mutation checkoutLineItemsUpdate($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
  checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
    checkout {
      ${checkoutFragment}
    }
    checkoutUserErrors {
      message
    }
  }
}`;

const checkoutQueries = {
  queryCreateCheckout,
  queryAddLinesItem,
  queryCheckoutById,
  queryAddCustomerToCheckout,
  queryRemoveFromCheckout,
  queryUpdateLine,
};

export default checkoutQueries;
