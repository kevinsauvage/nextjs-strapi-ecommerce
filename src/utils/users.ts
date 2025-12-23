import { storefrontSdk } from '@/shopify';

import { getShopifyToken } from './shopify';

export const getUser = async () => {
  const customerAccessToken = await getShopifyToken();

  if (!customerAccessToken) return;

  const response = await storefrontSdk('no-store').getCustomer({
    customerAccessToken,
    metafields: [],
  });

  return response?.customer;
};
