import { cookies } from 'next/headers';

import config from '@/config';
import type { CustomerAccessToken } from '@/shopify/storefront';

export const setShopifyToken = async (customerAccessToken: CustomerAccessToken) => {
  if (!customerAccessToken) return;
  const { accessToken } = customerAccessToken || {};
  if (!accessToken) return { error: true };
  const expiresAtDate = new Date(customerAccessToken.expiresAt as string);

  const cookieStore = await cookies();

  cookieStore.set({
    expires: expiresAtDate,
    name: config.cookies.shopifyToken,
    path: '/',
    value: accessToken,
  });
};

export const getShopifyToken = async (): Promise<
  CustomerAccessToken['accessToken'] | undefined
> => {
  const cookieStore = await cookies();
  return cookieStore.get(config.cookies.shopifyToken)?.value;
};

export const getShopifyCartId = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(config.cookies.cartId)?.value;
};
