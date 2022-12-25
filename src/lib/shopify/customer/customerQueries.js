import {
  addressFragment,
  customerFragment,
  customerOrdersFragment,
  orderFragment,
  variantFragment,
} from '../fragment';

const queryRegister = `
mutation ($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    userErrors { field message }
  }
}`;

const queryLogin = `
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken { accessToken expiresAt }
    customerUserErrors { message }
  }
}`;

const querySendRecoverEmail = `
mutation customerRecover($email: String!) {
  customerRecover(email: $email) {
    customerUserErrors { field message }
  }
}`;

const queryResetPassword = `
mutation customerResetByUrl($password: String!, $resetUrl: URL!) {
  customerResetByUrl(password: $password, resetUrl: $resetUrl) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message}
  }
}`;

const queryCustomer = `
query customer ($token: String!) {
  customer(customerAccessToken: $token) {
    ${customerFragment}
  }
}`;

const queryCustomerOrders = `
query customer ($token: String!) {
  customer(customerAccessToken: $token) {
    ${customerOrdersFragment}
  }
}`;

const queryRefreshToken = `
mutation ($token: String!) {
  customerAccessTokenRenew(customerAccessToken: $token) {
    customerAccessToken { accessToken expiresAt }
    userErrors { field message }
  }
}`;

const queryDelegateAccessToken = `
mutation delegateAccessTokenCreate($input: DelegateAccessTokenInput!) {
  delegateAccessTokenCreate(input: $input) {
    delegateAccessToken {
      accessToken
      createdAt
    }
    userErrors {
      field
      message
    }
  }
}`;

const customerAccessTokenDelete = `
mutation customerAccessTokenDelete($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    deletedAccessToken
    deletedCustomerAccessTokenId
    userErrors { field message }
  }
}`;

const getOrderById = `
query ($id: ID!) {
  node(id: $id) {
    ... on Order {
        ${orderFragment}
        lineItems(first: 250) {
            edges {
                node {
                  quantity
                  title
                  quantity
                  variant {
                      ${variantFragment}
                  }
                }
            }
        }
    }
  }
}`;

const createAddress = `
mutation customerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
  customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
    customerAddress {
      ${addressFragment}
    }
    customerUserErrors {
      message
    }
  }
}`;

const updateAddress = `
mutation customerAddressUpdate($address: MailingAddressInput!, $customerAccessToken: String!, $id: ID!) {
  customerAddressUpdate(address: $address, customerAccessToken: $customerAccessToken, id: $id) {
    customerAddress {
      ${addressFragment}
    }
    customerUserErrors {
      message
    }
  }
}`;

const queryCustomerAddresses = `
query customer ($token: String!) {
  customer(customerAccessToken: $token) {
    addresses(first: 100) {
      edges {
        node {
          ${addressFragment}
        }
      }
    }
  }
}
`;

const updateDefaultAddress = `
mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
  customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
    customer {
      ${customerFragment}
    }
    customerUserErrors {
      message
    }
  }
}`;

const updateCustomer = `
mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
  customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
    customer { ${customerFragment} }
    customerAccessToken { accessToken expiresAt }
    customerUserErrors { message }
  }
}`;

const getCustomerAddressById = `
query ($id: ID!) {
  node(id: $id) {
    ... on MailingAddress {
        ${addressFragment}
    }
  }
}`;

const deleteAddressById = `
mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
  customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
    customerUserErrors { message }
    deletedCustomerAddressId
  }
}`;

const customerQueries = {
  queryRegister,
  queryLogin,
  querySendRecoverEmail,
  queryResetPassword,
  queryCustomer,
  queryRefreshToken,
  queryDelegateAccessToken,
  customerAccessTokenDelete,
  queryCustomerOrders,
  getOrderById,
  updateAddress,
  queryCustomerAddresses,
  createAddress,
  updateDefaultAddress,
  getCustomerAddressById,
  updateCustomer,
  deleteAddressById,
};

export default customerQueries;
