import { apiCall } from './index';

export const registerCustomer = async (email, password, language) => {
  const mutation = `mutation @inContext(language: ${language.toUpperCase()}){
      customerCreate(input: {
        email:"${email}", 
        password:"${password}"
      }) {
        userErrors { field message }
        customer { id }
      }
    }`;
  return apiCall(mutation);
};

export const loginCustomer = async (email, password, language) => {
  const mutation = `mutation @inContext(language: ${language.toUpperCase()}) { 
      customerAccessTokenCreate(input: {
        email:"${email}", 
        password:"${password}"
      }) { 
        customerAccessToken { accessToken expiresAt }, 
        customerUserErrors { code field message } 
      } 
    }`;

  return apiCall(mutation);
};

export const sendRecoverEmail = (email, language) => {
  const mutation = `mutation @inContext(language: ${language.toUpperCase()}) {
    customerRecover(email: "${email}") { customerUserErrors { code field message} }
    }`;

  return apiCall(mutation);
};

export const resetCustomerPassword = (password, resetUrl, language) => {
  const mutation = `mutation @inContext(language: ${language.toUpperCase()}) {
      customerResetByUrl(resetUrl: "${resetUrl}", password: "${password}") {
        customer { id, email },
        customerAccessToken { accessToken expiresAt }, 
        customerUserErrors { code field message}
      }
    }`;

  return apiCall(mutation);
};

export const getUser = async (token, language) => {
  const query = `query @inContext(language: ${language.toUpperCase()}) {
      customer(customerAccessToken: "${token}") {
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

  return apiCall(query);
};

export const refreshToken = async (token) => {
  const mutation = `mutation  {
      customerAccessTokenRenew(customerAccessToken: "${token}") {
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
  const response = await apiCall(mutation);
  const customerAccessTokenRenew = response?.customerAccessTokenRenew;
  const errors = customerAccessTokenRenew?.userErrors;
  const refresh = customerAccessTokenRenew?.customerAccessToken;
  return { errors, refresh };
};

export const associateCustomerToCheckout = async (
  checkoutId,
  customerAccessToken
) => {
  const mutation = `mutation {
    checkoutCustomerAssociateV2(
      checkoutId: "${checkoutId}"
      customerAccessToken: "${customerAccessToken}"
    ) {
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

  const response = await apiCall(mutation);
  console.log(response);
};
