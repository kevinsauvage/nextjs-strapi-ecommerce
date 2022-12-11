import shopifyStorefrontCall, { shopifyAdminApiCall } from '..';
import customerQueries from './customerQueries';

export const registerCustomer = async (input, delegateToken, ip) => {
  console.log(
    `registerCustomer with delegate token: ${delegateToken}  and ip: ${ip} -------------------------------`
  );

  const res = await shopifyStorefrontCall(
    customerQueries.queryRegister,
    {
      input,
    },
    delegateToken,
    ip
  );

  return res?.data?.customerCreate;
};

export const loginCustomer = async (input, delegateToken, ip) => {
  console.log(
    `loginCustomer with delegate token: ${delegateToken}  and ip: ${ip} -------------------------------`
  );

  const res = await shopifyStorefrontCall(
    customerQueries.queryLogin,
    {
      input,
    },
    delegateToken,
    ip
  );
  return res?.data?.customerAccessTokenCreate;
};

export const deleteAccessToken = async (
  customerAccessToken,
  delegateToken,
  ip
) => {
  console.log(
    `deleteAccessToken with delegate token: ${delegateToken}  and ip: ${ip} -------------------------------`
  );

  const res = await shopifyStorefrontCall(
    customerQueries.customerAccessTokenDelete,
    {
      customerAccessToken,
    },
    delegateToken,
    ip
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

  return res?.data?.customerRecover;
};

export const resetCustomerPassword = async (
  password,
  resetUrl,
  delegateToken,
  ip
) => {
  console.log(
    `Reset password with delegate token: ${delegateToken} and ip: ${ip} -------------------------------`
  );

  const res = await shopifyStorefrontCall(
    customerQueries.queryResetPassword,
    {
      password,
      resetUrl,
    },
    delegateToken,
    ip
  );

  console.log(res, 'response');
  return res?.data?.customerResetByUrl;
};

export const getUser = async (token, delegateToken, ip) => {
  console.log(
    `getUser with delegate token: ${delegateToken} and ip: ${ip} -------------------------------`
  );

  const res = await shopifyStorefrontCall(
    customerQueries.queryCustomer,
    {
      token,
    },
    delegateToken,
    ip
  );
  return res?.data;
};

export const refreshToken = async (token, delegateToken, ip) => {
  console.log(
    `refreshToken with delegate token: ${delegateToken}  and ip: ${ip} -------------------------------`
  );

  const res = await shopifyStorefrontCall(
    customerQueries.queryRefreshToken,
    {
      token,
    },
    delegateToken,
    ip
  );
  return res?.data?.customerAccessTokenRenew;
};

// ADMIN CALLS
export const getDelegateToken = async (input) => {
  console.log(`getDelegateToken-------------------------------------`);

  const res = await shopifyAdminApiCall(
    customerQueries.queryDelegateAccessToken,
    {
      input,
    }
  );

  console.log(res, 'delegate response');
  return res?.data?.delegateAccessTokenCreate ?? null;
};
