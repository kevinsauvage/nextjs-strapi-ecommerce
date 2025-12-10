import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import config from '@/config';

import { createCart } from './cart';

export async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  let cartId = cookieStore.get(config.cookies.cartId)?.value;

  if (!cartId) {
    const newCart = await createCart();
    cartId = newCart.id;
    cookieStore.set(config.cookies.cartId, cartId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  return cartId;
}

export function revalidateCart(cartId: string): void {
  revalidateTag('cart');
  revalidateTag(`cart-${cartId}`);
}

