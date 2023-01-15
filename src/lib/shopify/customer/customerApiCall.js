/* eslint-disable no-console */
import shopifyStorefrontCall, { shopifyAdminApiCall } from '..';
import { cleanGraphQLResponse } from '../helpers';
import customerQueries from './customerQueries';

export const registerCustomer = async (input, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(customerQueries.queryRegister, { input }, delegateToken, ip);
    return res?.data?.customerCreate;
  } catch (err) {
    return console.error(err);
  }
};

export const loginCustomer = async (input, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(customerQueries.queryLogin, { input }, delegateToken, ip);
    return res?.data?.customerAccessTokenCreate;
  } catch (err) {
    return console.error(err);
  }
};

export const deleteAccessToken = async (customerAccessToken, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.customerAccessTokenDelete,
      { customerAccessToken },
      delegateToken,
      ip
    );
    const response = res?.data?.customerAccessTokenDelete;
    return response;
  } catch (err) {
    return console.error(err);
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
    return res?.data?.customerRecover;
  } catch (err) {
    return console.error(err);
  }
};

export const resetCustomerPassword = async (password, resetUrl, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryResetPassword,
      { password, resetUrl },
      delegateToken,
      ip
    );
    return res?.data?.customerResetByUrl;
  } catch (err) {
    return console.error(err);
  }
};

export const getUser = async (token, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(customerQueries.queryCustomer, { token }, delegateToken, ip);
    const response = { response: cleanGraphQLResponse(res?.data), errors: res?.errors };
    return response;
  } catch (err) {
    return console.error(err);
  }
};

export const updateUserInfo = async (customerAccessToken, customer, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.updateCustomer,
      { customerAccessToken, customer },
      delegateToken,
      ip
    );
    return cleanGraphQLResponse(res?.data?.customerUpdate);
  } catch (err) {
    return console.error(err);
  }
};

export const getUserOrders = async (token, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryCustomerOrders,
      { token },
      delegateToken,
      ip
    );
    return cleanGraphQLResponse(res?.data?.customer?.orders);
  } catch (err) {
    return console.error(err);
  }
};

export const getOrderById = async (id, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(customerQueries.getOrderById, { id }, delegateToken, ip);
    return cleanGraphQLResponse(res?.data?.node);
  } catch (err) {
    return console.error(err);
  }
};

export const refreshToken = async (token, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(customerQueries.queryRefreshToken, { token }, delegateToken, ip);
    return res?.data?.customerAccessTokenRenew;
  } catch (err) {
    return console.error(err);
  }
};

export const getDelegateToken = async (input) => {
  try {
    const res = await shopifyAdminApiCall(customerQueries.queryDelegateAccessToken, { input });
    return res?.data?.delegateAccessTokenCreate;
  } catch (err) {
    return console.error(err);
  }
};

export const createAddress = async (address, customerAccessToken, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.createAddress,
      { address, customerAccessToken },
      delegateToken,
      ip
    );
    return res?.data?.customerAddressCreate;
  } catch (err) {
    return console.error(err);
  }
};

export const deleteAddressById = async (customerAccessToken, id, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.deleteAddressById,
      { customerAccessToken, id },
      delegateToken,
      ip
    );
    const response = cleanGraphQLResponse(res?.data?.customerAddressDelete);
    return response;
  } catch (err) {
    return console.error(err);
  }
};

export const updateAddress = async (address, customerAccessToken, id, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.updateAddress,
      { address, customerAccessToken, id },
      delegateToken,
      ip
    );
    return res?.data?.customerAddressUpdate;
  } catch (err) {
    return console.error(err);
  }
};

export const updateDefaultAddress = async (customerAccessToken, addressId, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.updateDefaultAddress,
      { customerAccessToken, addressId },
      delegateToken,
      ip
    );
    return cleanGraphQLResponse(res?.data?.customerDefaultAddressUpdate);
  } catch (err) {
    return console.error(err);
  }
};

export const getCustomerAddresses = async (token, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryCustomerAddresses,
      { token },
      delegateToken,
      ip
    );
    const response = cleanGraphQLResponse(res?.data);
    return response?.customer?.addresses;
  } catch (error) {
    return console.error(error);
  }
};

export const getCustomerAddressById = async (token, id, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.getCustomerAddressById,
      { token, id },
      delegateToken,
      ip
    );
    const response = cleanGraphQLResponse(res?.data);
    return response.node;
  } catch (error) {
    return console.error(error);
  }
};
