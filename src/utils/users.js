import getClient from '@/shopify';

import { getShopifyToken } from './shopify';

export const getUser = async () => {
  const customerAccessToken = await getShopifyToken();

  if (!customerAccessToken) return;

  return await getClient().storefront.customer.queryCustomer({
    customerAccessToken,
  });
};
