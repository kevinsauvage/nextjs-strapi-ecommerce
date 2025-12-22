import { NextRequest, NextResponse } from 'next/server';

import { handleUserErrors } from '@/helpers/shopify';
import { getCartId, revalidateCart } from '@/lib/cart-helpers';
import { storefrontSdk } from '@/shopify';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  const cartId = await getCartId();

  if (!cartId) {
    return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { discountCodes } = body as { discountCodes: string[] };

    if (!Array.isArray(discountCodes)) {
      return NextResponse.json({ error: 'Invalid discount codes format' }, { status: 400 });
    }

    const updateDiscountCodesResponse = await storefrontSdk('no-store').cartDiscountCodesUpdate({
      cartId,
      discountCodes,
      first: 100,
    });

    const { cart, userErrors, warnings } =
      updateDiscountCodesResponse?.cartDiscountCodesUpdate || {};

    const userErrorResult = handleUserErrors(userErrors);
    if (userErrorResult) {
      return NextResponse.json(
        {
          error: 'Failed to update discount codes',
          userErrors: userErrorResult.userErrors,
        },
        { status: 400 },
      );
    }

    if (warnings && Array.isArray(warnings) && warnings?.length) {
      console.warn('Discount code warnings:', warnings);
    }

    if (cart) {
      revalidateCart();

      return NextResponse.json(
        {
          data: cart,
          message: 'Discount codes updated successfully',
          warnings: warnings || [],
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: 'Failed to update discount codes' }, { status: 500 });
  } catch (error) {
    console.error('PATCH /api/cart/discount-codes error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update discount codes' },
      { status: 500 },
    );
  }
}
