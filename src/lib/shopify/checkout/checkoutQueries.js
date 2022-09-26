const queryAddCustomerToCheckout = `mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
    checkoutCustomerAssociateV2(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
        checkout {
          id
        }
        checkoutUserErrors {
          code
        }
        customer {
          id
        }
      }
  }`;

const checkoutQueries = {
  queryAddCustomerToCheckout,
};

export default checkoutQueries;
