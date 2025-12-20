'use server';

import { cookies } from 'next/headers';

import config from '@/config';
import { createCart } from '@/lib/cart';
import { revalidateCart } from '@/lib/cart-helpers';
import type { CartFieldsFragment } from '@/shopify/storefront';
import { getSecureCookieOptions } from '@/utils/cookie-security';

export async function createCartAction(): Promise<CartFieldsFragment> {
  const newCart = await createCart();

  const cookieStore = await cookies();
  cookieStore.set(config.cookies.cartId, newCart.id, getSecureCookieOptions());

  revalidateCart();

  return newCart;
}
