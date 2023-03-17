import ShopifyClient from '@kevinsauvage/shopify-storefront-api';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN;
const adminToken = process.env.SHOPIFY_STORE_FRONT_ADMIN_TOKEN;
const apiVersion = '2023-01';

const getClient = (delegateToken, buyerIp) => {
  const config = {
    accessToken,
    adminToken,
    apiVersion,
    buyerIp,
    delegateToken,
    domain,
  };
  return new ShopifyClient(config);
};

export default getClient;
