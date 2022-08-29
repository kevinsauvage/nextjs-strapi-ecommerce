import Client from 'shopify-buy';

export const parseShopifyResponse = (response) =>
  JSON.parse(JSON.stringify(response));

export const getShopifyClient = (language) =>
  Client.buildClient({
    storefrontAccessToken: process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
    domain: process.env.SHOPIFY_STORE_DOMAIN,
    language,
  });
