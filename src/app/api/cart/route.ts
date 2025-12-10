import { NextRequest, NextResponse } from 'next/server';

import { getCartIdAction } from '@/actions/cartActions';
import { createCart, getCart } from '@/lib/cart';
import { getOrCreateCartId, revalidateCart } from '@/lib/cart-helpers';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const cartId = await getCartIdAction();
    const cart = cartId ? await getCart(cartId) : await createCart();

    return NextResponse.json({ data: cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch cart' },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const cartId = await getOrCreateCartId();
    const cart = await getCart(cartId);

    if (!cart) {
      throw new Error('Failed to create or fetch cart');
    }

    revalidateCart(cartId);

    return NextResponse.json({ data: cart, message: 'Cart created successfully' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/cart error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create cart' },
      { status: 500 },
    );
  }
}
