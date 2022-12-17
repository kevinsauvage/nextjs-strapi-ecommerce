import shopifyStorefrontCall, { shopifyAdminApiCall } from '..';
import customerQueries from './customerQueries';

export const registerCustomer = async (input, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryRegister,
      { input },
      delegateToken,
      ip
    );
    const response = res?.data?.customerCreate;
    if (response) return response;
    return null;
  } catch (err) {
    return console.log(err);
  }
};

export const loginCustomer = async (input, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryLogin,
      { input },
      delegateToken,
      ip
    );
    const response = res?.data?.customerAccessTokenCreate;
    if (response) return response;
    return null;
  } catch (err) {
    return console.log(err);
  }
};

export const deleteAccessToken = async (
  customerAccessToken,
  delegateToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.customerAccessTokenDelete,
      { customerAccessToken },
      delegateToken,
      ip
    );
    const response = res?.data?.customerAccessTokenDelete;
    const userErrors = response?.userErrors;
    if (userErrors?.length > 0) {
      console.error(JSON.stringify(userErrors));
    }
    return response;
  } catch (err) {
    return console.log(err);
  }
};

export const sendRecoverEmail = async (email, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.querySendRecoverEmail,
      { email },
      delegateToken,
      ip
    );
    const response = res?.data?.customerRecover;
    return response;
  } catch (err) {
    return console.log(err);
  }
};

export const resetCustomerPassword = async (
  password,
  resetUrl,
  delegateToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryResetPassword,
      { password, resetUrl },
      delegateToken,
      ip
    );

    return res?.data?.customerResetByUrl;
  } catch (err) {
    return console.log(err);
  }
};

export const getUser = async (token, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryCustomer,
      { token },
      delegateToken,
      ip
    );
    return res?.data;
  } catch (err) {
    return console.log(err);
  }
};

export const refreshToken = async (token, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryRefreshToken,
      { token },
      delegateToken,
      ip
    );
    return res?.data?.customerAccessTokenRenew;
  } catch (err) {
    return console.log(err);
  }
};

// ADMIN CALLS
export const getDelegateToken = async (input) => {
  try {
    const res = await shopifyAdminApiCall(
      customerQueries.queryDelegateAccessToken,
      { input }
    );
    return res?.data?.delegateAccessTokenCreate ?? null;
  } catch (err) {
    return console.log(err);
  }
};
