const domain = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN;
const adminToken = process.env.SHOPIFY_STORE_FRONT_ADMIN_TOKEN;

/**
 * It's a function that makes a call to the Shopify Storefront API.
 * @param query - The GraphQL query to be sent to the Shopify Storefront API.
 * @param variables - { name: "Rolland", email: "shopify@shopify.com"}
 * @param delegateToken - The token that you get from the backend.
 * @param ip - The IP address of the customer making the request.
 * @returns The response from the Shopify Storefront API.
 */
const shopifyStorefrontCall = async (query, variables, delegateToken, ip) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (delegateToken && ip) {
      headers['Shopify-Storefront-Private-Token'] = delegateToken;
      headers['Shopify-Storefront-Buyer-IP'] = ip;
    } else headers['X-Shopify-Storefront-Access-Token'] = accessToken;

    const body = JSON.stringify({
      query,
      variables,
    });

    const response = await fetch(`https://${domain}/api/2022-10/graphql.json`, {
      method: 'POST',
      headers,
      body,
    });

    const res = response && (await response.json());

    return res;
  } catch (error) {
    // TODO HANDLE ERRORS
    return console.error('Error ----------------------', error);
  }
};

/**
 * It takes a GraphQL query and variables as arguments, and returns the response from the Shopify Admin
 * API
 * @param query - The query you want to run.
 * @param variables - {
 * @returns The response from the Shopify API.
 */
export const shopifyAdminApiCall = async (query, variables) => {
  try {
    const response = await fetch(
      `https://${domain}/admin/api/2022-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );
    const res = await response.json();
    if (res.errors) {
      console.error(res.errors);
    }
    return res;
  } catch (error) {
    // TODO HANDLE ERRORS
    return console.error(error);
  }
};

export default shopifyStorefrontCall;
