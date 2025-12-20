import { NextResponse } from 'next/server';

import { getCart } from '@/lib/cart';
import { getCartId } from '@/lib/cart-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cartId = await getCartId();

    if (!cartId) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const cart = await getCart(cartId);

    if (!cart) {
      throw new Error('Failed to fetch cart');
    }

    return NextResponse.json({ data: cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch cart' },
      { status: 500 },
    );
  }
}
