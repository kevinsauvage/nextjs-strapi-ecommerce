import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import config from '@/config';

export async function getCartId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(config.cookies.cartId)?.value;
  return cartId || null;
}

export function revalidateCart(): void {
  revalidatePath(config.routes.cart);
}
