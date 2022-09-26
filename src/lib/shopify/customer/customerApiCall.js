import shopifyStorefrontCall from '..';
import customerQueries from './customerQueries';

export const registerCustomer = async (input) => {
  const res = await shopifyStorefrontCall(customerQueries.queryRegister, {
    input,
  });

  return res?.customerCreate;
};

export const loginCustomer = async (input) => {
  const res = await shopifyStorefrontCall(customerQueries.queryLogin, {
    input,
  });
  return res?.customerAccessTokenCreate;
};

export const sendRecoverEmail = async (email) => {
  const res = await shopifyStorefrontCall(
    customerQueries.querySendRecoverEmail,
    {
      email,
    }
  );

  console.log(res);
  return res?.customerRecover;
};

export const resetCustomerPassword = async (password, resetUrl) => {
  const res = await shopifyStorefrontCall(customerQueries.queryResetPassword, {
    password,
    resetUrl,
  });
  return res?.customerResetByUrl;
};

export const getUser = async (token) => {
  const res = await shopifyStorefrontCall(customerQueries.queryCustomer, {
    token,
  });
  return res;
};

export const refreshToken = async (token) => {
  const res = await shopifyStorefrontCall(customerQueries.queryRefreshToken, {
    token,
  });
  return res?.customerAccessTokenRenew;
};
