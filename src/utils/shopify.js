import { cookies } from 'next/headers';

import config from '@/config';

export const setShopifyToken = async (customerAccessToken) => {
  if (!customerAccessToken) return;
  const { accessToken, expiresAt } = customerAccessToken || {};

  if (!accessToken) return { error: true };

  const cookieStore = await cookies();

  cookieStore.set({
    expires: new Date(expiresAt),
    name: config.cookies.shopifyToken,
    path: '/',
    value: accessToken,
  });
};

export const getShopifyToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(config.cookies.shopifyToken)?.value;
};

export const getShopifyCartId = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(config.cookies.cartId)?.value;
};

export const getShopifyDelegateToken = async () => {
  const cookiesStore = await cookies();
  return cookiesStore.get('shopifyDelegateToken')?.value;
};
