import shopifyStorefrontCall from '..';
import customerQueries from './customerQueries';

export const registerCustomer = async (input) => {
  const res = await shopifyStorefrontCall(customerQueries.queryRegister, {
    input,
  });

  return res?.data?.customerCreate;
};

export const loginCustomer = async (input) => {
  const res = await shopifyStorefrontCall(customerQueries.queryLogin, {
    input,
  });
  return res?.data?.customerAccessTokenCreate;
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

export const getUser = async (token) => {
  const res = await shopifyStorefrontCall(customerQueries.queryCustomer, {
    token,
  });
  return res?.data;
};

export const refreshToken = async (token) => {
  const res = await shopifyStorefrontCall(customerQueries.queryRefreshToken, {
    token,
  });
  return res?.data?.customerAccessTokenRenew;
};
