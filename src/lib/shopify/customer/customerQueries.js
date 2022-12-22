import {
  customerFragment,
  customerOrdersFragment,
  orderFragment,
  variantFragment,
} from '../fragment';

const queryRegister = `
mutation ($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    userErrors { field message }
    customer {
      ${customerFragment}
    }
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
      customer {
        ${customerFragment}
      }
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
};

export default customerQueries;
