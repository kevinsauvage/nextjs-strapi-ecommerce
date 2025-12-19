import { cookies } from 'next/headers';

import config from '@/config';
import type { CustomerAccessToken } from '@/shopify/storefront';
import { getSecureCookieOptions } from '@/utils/cookie-security';

export const setShopifyToken = async (customerAccessToken: CustomerAccessToken): Promise<void> => {
  if (!customerAccessToken) return;
  const { accessToken } = customerAccessToken || {};
  if (!accessToken) return;
  const expiresAtDate = new Date(customerAccessToken.expiresAt as string);

  const cookieStore = await cookies();

  cookieStore.set({
    name: config.cookies.shopifyToken,
    value: accessToken,
    ...getSecureCookieOptions({ expires: expiresAtDate }),
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
