import { NextRequest, NextResponse } from 'next/server';

import { handleUserErrors } from '@/helpers/shopify';
import { getOrCreateCartId, revalidateCart } from '@/lib/cart-helpers';
import { storefrontSdk } from '@/shopify';
import { adjustPaginationVariables } from '@/shopify/helpers';
import type { CartBuyerIdentityInput, GetCustomerQuery } from '@/shopify/storefront';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  const cartId = await getOrCreateCartId();

  try {
    const body = await request.json();
    const { customerAccessToken, user, first, last, after, before } = body as {
      customerAccessToken: string;
      user: GetCustomerQuery['customer'];
      first?: number;
      last?: number;
      after?: string;
      before?: string;
    };

    if (!customerAccessToken) {
      return NextResponse.json({ error: 'Missing customerAccessToken' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Missing user' }, { status: 400 });
    }

    const buyerIdentity = {
      customerAccessToken,
      email: user.email,
      phone: user.phone,
    } as CartBuyerIdentityInput;

    const updateResponse = await storefrontSdk().cartBuyerIdentityUpdate({
      buyerIdentity,
      cartId,
      ...adjustPaginationVariables({
        after: after || '',
        before: before || '',
        first: first || 0,
        last: last || 0,
      }),
    });

    const { cart, userErrors } = updateResponse?.cartBuyerIdentityUpdate || {};

    handleUserErrors(userErrors);

    if (cart) {
      revalidateCart(cartId);

      return NextResponse.json(
        { data: cart, message: 'Cart buyer identity updated successfully' },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: 'Failed to update cart buyer identity' }, { status: 500 });
  } catch (error) {
    console.error('PATCH /api/cart/buyer-identity error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update cart buyer identity' },
      { status: 500 },
    );
  }
}

