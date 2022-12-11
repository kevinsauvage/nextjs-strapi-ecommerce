const domain = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN;
const adminToken = process.env.SHOPIFY_STORE_FRONT_ADMIN_TOKEN;

const shopifyStorefrontCall = async (query, variables, delegateToken, ip) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (delegateToken && ip) {
      headers['Shopify-Storefront-Private-Token'] = delegateToken;
      headers['Shopify-Storefront-Buyer-IP'] = ip;
      console.log(headers, 'headers');
    } else headers['X-Shopify-Storefront-Access-Token'] = accessToken;

    const body = JSON.stringify({
      query,
      variables,
    });

    // console.log('body >>>>', body);

    const response = await fetch(`https://${domain}/api/2022-07/graphql.json`, {
      method: 'POST',
      headers,
      body,
    });

    const res = response && (await response.json());
    return res;
  } catch (error) {
    // TODO HANDLE ERRORS
    return console.log('Error catched----------------------', error);
  }
};

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
