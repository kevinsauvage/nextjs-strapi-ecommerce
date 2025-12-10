'use server';

import { cookies } from 'next/headers';

import config from '@/config';

export async function getCartIdAction(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(config.cookies.cartId)?.value || null;
}
