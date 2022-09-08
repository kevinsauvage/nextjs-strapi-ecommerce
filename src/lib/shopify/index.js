import Client from 'shopify-buy';

export const parseShopifyResponse = (response) =>
  JSON.parse(JSON.stringify(response));

export const getShopifyClient = (language) => {
  const config = {
    storefrontAccessToken:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
    domain: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN,
    language: language || 'en',
  };

  return Client.buildClient({ ...config });
};

export const apiCall = async (query) => {
  try {
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN}/api/2022-07/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/graphql',
          'X-Shopify-Storefront-Access-Token':
            process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
        },
        body: query,
      }
    );
    const res = await response.json();
    if (res && res.data) return res.data;

    if (res && res.errors) {
      return console.log(res.errors);
      // TODO HANDLE ERRORS
    }
    return res;
  } catch (err) {
    return console.log(err);
    // TODO handle error here
  }
};
