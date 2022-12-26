/* eslint-disable no-console */
import shopifyStorefrontCall, { shopifyAdminApiCall } from '..';
import { cleanGraphQLResponse } from '../helpers';
import customerQueries from './customerQueries';

/**
 * It takes in an input object, a delegate token, and an IP address, and returns a response object
 * @param input - { email: 'test@test.com', password: 'test' }
 * @param delegateToken - This is the token that you get from the Shopify ADMIN API.
 * @param ip - The IP address of the customer.
 * @returns The response is an object with the following properties:
 */
export const registerCustomer = async (input, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryRegister,
      { input },
      delegateToken,
      ip
    );
    return res?.data?.customerCreate;
  } catch (err) {
    return console.error(err);
  }
};
/**
 * It takes in an input object, a delegate token, and an IP address, and returns a response object.
 * @param input - { email: 'test@test.com', password: 'test' }
 * @param delegateToken - This is the token that you get from the Shopify ADMIN API.
 * @param ip - The IP address of the customer.
 * @returns The response is an object with the following properties:
 */
export const loginCustomer = async (input, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryLogin,
      { input },
      delegateToken,
      ip
    );
    return res?.data?.customerAccessTokenCreate;
  } catch (err) {
    return console.error(err);
  }
};
/**
 * It deletes a customer's access token from the Shopify store.
 * @param customerAccessToken - The token that you want to delete.
 * @param delegateToken - This is the token that you get from the Shopify ADMIN API.
 * @param ip - The IP address of the customer.
 * @returns The response is a JSON object with a single key, "customerAccessTokenDelete".
 */
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
    return response;
  } catch (err) {
    return console.error(err);
  }
};
/**
 * It sends a password reset email to the customer's email address
 * @param email - the email address of the customer
 * @param delegateToken - This is the token that you get from the Shopify ADMIN API.
 * @param ip - The IP address of the customer.
 * @returns The response is a JSON object with the following properties:
 */
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
/**
 * It takes a password, resetUrl, delegateToken, and ip as arguments and returns a customerResetByUrl
 * object.
 * @param password - The new password for the customer.
 * @param resetUrl - The reset URL that was sent to the customer's email address.
 * @param delegateToken - This is the token that you get from the Shopify ADMIN API.
 * @param ip - The IP address of the customer.
 * @returns customer - The customer object
 */
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
    return console.error(err);
  }
};
/**
 * It takes a token, a delegate token, and an IP address, and returns a customer object.
 * @param token - The token that is returned from the Shopify API when a user logs in.
 * @param delegateToken - This is the token that you get from the Shopify ADMIN API.
 * @param ip - The IP address of the user making the request.
 * @returns The customer object.
 */
export const getUser = async (token, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryCustomer,
      { token },
      delegateToken,
      ip
    );
    const response = cleanGraphQLResponse(res?.data);
    return response;
  } catch (err) {
    return console.error(err);
  }
};

export const updateUserInfo = async (
  customerAccessToken,
  customer,
  delegateToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.updateCustomer,
      { customerAccessToken, customer },
      delegateToken,
      ip
    );

    const response = cleanGraphQLResponse(res?.data?.customerUpdate);
    return response;
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

    const response = cleanGraphQLResponse(res?.data);
    return response;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It takes an order id, a delegate token, and an ip address, and returns the order object.
 * @param id - the order id
 * @param delegateToken - The token that is generated by the Shopify API.
 * @param ip - the IP address of the customer
 * @returns The order
 */
export const getOrderById = async (id, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.getOrderById,
      { id },
      delegateToken,
      ip
    );
    return cleanGraphQLResponse(res?.data?.node);
  } catch (err) {
    return console.error(err);
  }
};
/**
 * It takes a token, a delegate token, and an IP address, and returns a new token.
 * @param token - The token that needs to be refreshed
 * @param delegateToken - This is the token that you get from the Shopify ADMIN API.
 * @param ip - The IP address of the customer.
 * @returns The new customer token.
 */
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
    return console.error(err);
  }
};
/**
 * It takes an input object, and returns a response object
 * @param input - {
 * @returns Delegate access token.
 */
export const getDelegateToken = async (input) => {
  try {
    const res = await shopifyAdminApiCall(
      customerQueries.queryDelegateAccessToken,
      { input }
    );
    return res?.data?.delegateAccessTokenCreate;
  } catch (err) {
    return console.error(err);
  }
};

export const createAddress = async (
  address,
  customerAccessToken,
  delegateToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.createAddress,
      {
        address,
        customerAccessToken,
      },
      delegateToken,
      ip
    );
    return res?.data?.customerAddressCreate;
  } catch (err) {
    return console.error(err);
  }
};

export const deleteAddressById = async (
  customerAccessToken,
  id,
  delegateToken,
  ip
) => {
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

/**
 * It takes in an address object, a customer access token, an id, a delegate token, and an ip address,
 * and returns a response object.
 * @param address - The address object to be updated.
 * @param customerAccessToken - The customer's access token
 * @param id - The ID of the address to update
 * @param delegateToken - This is the token that you get from the Shopify API when you create a new
 * customer.
 * @param ip - the ip address of the user
 * @returns The address updated
 */
export const updateAddress = async (
  address,
  customerAccessToken,
  id,
  delegateToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.updateAddress,
      {
        address,
        customerAccessToken,
        id,
      },
      delegateToken,
      ip
    );
    return res?.data?.customerAddressUpdate;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It takes a customerAccessToken, addressId, delegateToken, and ip as arguments and returns a response
 * object.
 * @param customerAccessToken - "c8a8d8f8-f8f8-4f8f-8f8f-8f8f8f8f8f8f"
 * @param addressId - "gid://shopify/CustomerAddress/1234"
 * @param delegateToken - "gid://shopify/Customer/123456789"
 * @param ip - '127.0.0.1'
 * @returns customer
 */
export const updateDefaultAddress = async (
  customerAccessToken,
  addressId,
  delegateToken,
  ip
) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.updateDefaultAddress,
      {
        customerAccessToken,
        addressId,
      },
      delegateToken,
      ip
    );
    return cleanGraphQLResponse(res?.data?.customerDefaultAddressUpdate);
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It makes a call to the Shopify Storefront API to get the customer's addresses.
 * @param token - the customer's access token
 * @param delegateToken - "gid://shopify/Customer/123456789"
 * @param ip - '127.0.0.1'
 * @returns customers addresses
 */
export const getCustomerAddresses = async (token, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryCustomerAddresses,
      {
        token,
      },
      delegateToken,
      ip
    );

    const response = cleanGraphQLResponse(res?.data);
    return response?.customer?.addresses;
  } catch (error) {
    return console.error(error);
  }
};

/**
 * It takes a customer's token, the customer's address id, a delegate token, and an ip address, and
 * returns the customer's address.
 * @param token - The customer's access token
 * @param id - The ID of the customer address to retrieve.
 * @param delegateToken - This is the token that you get from the Shopify API when you create a new
 * customer.
 * @param ip - the ip address of the user
 * @returns The customer's address.
 */
export const getCustomerAddressById = async (token, id, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.getCustomerAddressById,
      {
        token,
        id,
      },
      delegateToken,
      ip
    );

    const response = cleanGraphQLResponse(res?.data);
    return response.node;
  } catch (error) {
    return console.error(error);
  }
};
