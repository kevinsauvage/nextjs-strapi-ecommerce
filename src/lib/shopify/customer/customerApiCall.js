import shopifyStorefrontCall, { shopifyAdminApiCall } from '..';
import customerQueries from './customerQueries';

export const registerCustomer = async (input, delegateToken) => {
  console.log(`registerCustomer with delegate token: ${delegateToken}`);

  const res = await shopifyStorefrontCall(
    customerQueries.queryRegister,
    {
      input,
    },
    delegateToken
  );

  return res?.data?.customerCreate;
};

export const loginCustomer = async (input, delegateToken) => {
  console.log(`loginCustomer with delegate token: ${delegateToken}`);

  const res = await shopifyStorefrontCall(
    customerQueries.queryLogin,
    {
      input,
    },
    delegateToken
  );
  return res?.data?.customerAccessTokenCreate;
};

export const deleteAccessToken = async (customerAccessToken, delegateToken) => {
  console.log(`deleteAccessToken with delegate token: ${delegateToken}`);

  const res = await shopifyStorefrontCall(
    customerQueries.customerAccessTokenDelete,
    {
      customerAccessToken,
    },
    delegateToken
  );

  const userErrors = res?.customerAccessTokenDelete?.userErrors;

  if (userErrors?.length > 0) {
    console.log(JSON.stringify(userErrors));
  }
  return res?.data;
};

export const sendRecoverEmail = async (email) => {
  const res = await shopifyStorefrontCall(
    customerQueries.querySendRecoverEmail,
    {
      email,
    }
  );

  return res;
};

export const resetCustomerPassword = async (password, resetUrl) => {
  const res = await shopifyStorefrontCall(customerQueries.queryResetPassword, {
    password,
    resetUrl,
  });
  return res?.data?.customerResetByUrl;
};

export const getUser = async (token, delegateToken) => {
  console.log(`getUser with delegate token: ${delegateToken}`);

  const res = await shopifyStorefrontCall(
    customerQueries.queryCustomer,
    {
      token,
    },
    delegateToken
  );
  return res?.data;
};

export const refreshToken = async (token) => {
  const res = await shopifyStorefrontCall(customerQueries.queryRefreshToken, {
    token,
  });
  return res?.data?.customerAccessTokenRenew;
};

// ADMIN CALLS
export const getDelegateToken = async (input) => {
  console.log('getDelegateToken');

  const res = await shopifyAdminApiCall(
    customerQueries.queryDelegateAccessToken,
    {
      input,
    }
  );
  return res;
};
