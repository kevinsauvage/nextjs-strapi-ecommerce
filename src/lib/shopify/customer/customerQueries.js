const queryRegister = `mutation ($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      userErrors { field message }
      customer {
        id
        firstName
        lastName
        acceptsMarketing
        email
        phone
        defaultAddress {
          id
        }
        orders(first: 10) {
          edges {
              node {
                  id
                  name
                  totalPrice
                  fulfillmentStatus
                  currencyCode
              }
          }
        }
      }
    }
  }`;

const queryLogin = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) { 
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { message }
    } 
  }`;

const querySendRecoverEmail = `mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors { field message }
    }
  }`;

const queryResetPassword = `mutation customerResetByUrl($password: String!, $resetUrl: URL!) {
    customerResetByUrl(password: $password, resetUrl: $resetUrl) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { code field message}
        customer {
          id
          firstName
          lastName
          acceptsMarketing
          email
          phone
          defaultAddress {
            id
          }
          orders(first: 10) {
            edges {
                node {
                    id
                    name
                    totalPrice
                    fulfillmentStatus
                    currencyCode
                }
            }
          }
        }
    }
  }`;

const queryCustomer = `query customer ($token: String!) {
    customer(customerAccessToken: $token) {
      id
      firstName
      lastName
      acceptsMarketing
      email
      phone
      defaultAddress {
        id
      }
      orders(first: 10) {
        edges {
            node {
                id
                name
                totalPrice
                fulfillmentStatus
                currencyCode
            }
        }
      }
    }
  }`;

const queryRefreshToken = `mutation ($token: String!) {
    customerAccessTokenRenew(customerAccessToken: $token) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
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
};

export default customerQueries;
