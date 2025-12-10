import { NextRequest, NextResponse } from 'next/server';

import { handleUserErrors } from '@/helpers/shopify';
import { getOrCreateCartId, revalidateCart } from '@/lib/cart-helpers';
import { storefrontSdk } from '@/shopify';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  const cartId = await getOrCreateCartId();

  try {
    const body = await request.json();
    const { discountCodes } = body as { discountCodes: string[] };

    if (!Array.isArray(discountCodes)) {
      return NextResponse.json({ error: 'Invalid discount codes format' }, { status: 400 });
    }

    const updateDiscountCodesResponse = await storefrontSdk().cartDiscountCodesUpdate({
      cartId,
      discountCodes,
      first: 100,
    });

    const { cart, userErrors, warnings } =
      updateDiscountCodesResponse?.cartDiscountCodesUpdate || {};

    handleUserErrors(userErrors);

    if (warnings && Array.isArray(warnings) && warnings?.length) {
      console.warn('Discount code warnings:', warnings);
    }

    if (cart) {
      revalidateCart(cartId);

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
