import shopifyStorefrontCall, { shopifyAdminApiCall } from '..';
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
    const response = res?.data?.customerCreate;
    if (response) return response;
    return null;
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
    const response = res?.data?.customerAccessTokenCreate;
    if (response) return response;
    return null;
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
    const userErrors = response?.userErrors;
    if (userErrors?.length > 0) {
      console.error(JSON.stringify(userErrors));
    }
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
    const response = res?.data?.customerRecover;
    return response;
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
 * @returns {
 *   "data": {
 *     "customerResetByUrl": {
 *       "customer": {
 *         "id": "Z2lkOi8vc2hvcGlmeS9DdXN0b21lci8yMzUzMzUzMzUzMzUzMzU=",
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
    return res?.data;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It's a function that makes a call to the Shopify Storefront API to get the customer's order
 * information.
 * @param token - the customer's access token
 * @param delegateToken - This is the token that you get from the Shopify ADMIN API.
 * @param ip - the ip address of the user
 * @returns customer details
 */
export const getUserOrder = async (token, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      customerQueries.queryCustomerInfo,
      { token },
      delegateToken,
      ip
    );

    return res?.data;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It takes a token, a delegate token, and an IP address, and returns a new token.
 * @param token - The token that needs to be refreshed
 * @param delegateToken - This is the token that you get from the Shopify ADMIN API.
 * @param ip - The IP address of the customer.
 * @returns The response from the GraphQL query.
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

// ADMIN CALLS
/**
 * It takes an input object, and returns a response object
 * @param input - {
 * @returns The response from the API call.
 */
export const getDelegateToken = async (input) => {
  try {
    const res = await shopifyAdminApiCall(
      customerQueries.queryDelegateAccessToken,
      { input }
    );
    return res?.data?.delegateAccessTokenCreate ?? null;
  } catch (err) {
    return console.error(err);
  }
};
