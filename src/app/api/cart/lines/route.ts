import { NextRequest, NextResponse } from 'next/server';

import { handleUserErrors } from '@/helpers/shopify';
import { getOrCreateCartId, revalidateCart } from '@/lib/cart-helpers';
import { storefrontSdk } from '@/shopify';
import { adjustPaginationVariables } from '@/shopify/helpers';

export const dynamic = 'force-dynamic';

const DEFAULT_PAGINATION = {
  first: 100,
  last: 0,
  after: '',
  before: '',
};

export async function PATCH(request: NextRequest) {
  const cartId = await getOrCreateCartId();

  try {
    const body = await request.json();
    const { lines, operation = 'update' } = body as {
      lines?: Array<{ id: string; quantity: number }>;
      addLines?: Array<{ merchandiseId: string; quantity: number }>;
      operation?: 'update' | 'add';
    };

    const searchParams = request.nextUrl.searchParams;
    const first = searchParams.get('first')
      ? Number.parseInt(searchParams.get('first')!, 10)
      : DEFAULT_PAGINATION.first;
    const last = searchParams.get('last')
      ? Number.parseInt(searchParams.get('last')!, 10)
      : DEFAULT_PAGINATION.last;
    const after = searchParams.get('after') || DEFAULT_PAGINATION.after;
    const before = searchParams.get('before') || DEFAULT_PAGINATION.before;

    let cart;
    let userErrors;

    if (operation === 'add' && body.addLines) {
      const addLineResponse = await storefrontSdk().cartLinesAdd({
        cartId,
        lines: body.addLines,
        ...adjustPaginationVariables({ after, before, first, last }),
      });

      cart = addLineResponse?.cartLinesAdd?.cart;
      userErrors = addLineResponse?.cartLinesAdd?.userErrors;
    } else if (lines) {
      const updateLinesResponse = await storefrontSdk().cartLinesUpdate({
        cartId,
        lines,
        ...adjustPaginationVariables({ after, before, first, last }),
      });

      cart = updateLinesResponse?.cartLinesUpdate?.cart;
      userErrors = updateLinesResponse?.cartLinesUpdate?.userErrors;
    } else {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    handleUserErrors(userErrors);

    if (cart) {
      revalidateCart(cartId);

      return NextResponse.json(
        {
          data: cart,
          message: operation === 'add' ? 'Product added successfully' : 'Cart updated successfully',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        error: operation === 'add' ? 'Failed to add product' : 'Failed to update cart',
      },
      { status: 500 },
    );
  } catch (error) {
    console.error('PATCH /api/cart/lines error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update cart lines' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const cartId = await getOrCreateCartId();

  try {
    const searchParams = request.nextUrl.searchParams;
    const lineItemId = searchParams.get('lineItemId');

    if (!lineItemId) {
      return NextResponse.json({ error: 'Missing line item ID' }, { status: 400 });
    }
    const first = searchParams.get('first')
      ? Number.parseInt(searchParams.get('first')!, 10)
      : DEFAULT_PAGINATION.first;
    const last = searchParams.get('last')
      ? Number.parseInt(searchParams.get('last')!, 10)
      : DEFAULT_PAGINATION.last;
    const after = searchParams.get('after') || DEFAULT_PAGINATION.after;
    const before = searchParams.get('before') || DEFAULT_PAGINATION.before;

    const removeLinesResponse = await storefrontSdk().cartLinesRemove({
      cartId,
      lineIds: [lineItemId],
      ...adjustPaginationVariables({ after, before, first, last }),
    });

    const { cart, userErrors } = removeLinesResponse?.cartLinesRemove || {};

    handleUserErrors(userErrors);

    if (cart) {
      revalidateCart(cartId);

      return NextResponse.json(
        { data: cart, message: 'Product removed successfully' },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: 'Failed to remove product' }, { status: 500 });
  } catch (error) {
    console.error('DELETE /api/cart/lines error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove cart line' },
      { status: 500 },
    );
  }
}
