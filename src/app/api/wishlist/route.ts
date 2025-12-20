import { NextRequest, NextResponse } from 'next/server';

import {
  getWishlist,
  getWishlistErrorStatus,
  requireWishlistAuth,
  updateWishlistMetafields,
} from '@/lib/wishlist';
import type { ProductFieldsFragment } from '@/shopify/storefront';
import { getUser } from '@/utils/users';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const wishlist = await getWishlist();
    return NextResponse.json({ data: wishlist }, { status: 200 });
  } catch (error) {
    console.error('GET /api/wishlist error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch wishlist' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireWishlistAuth();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { product } = body as { product: ProductFieldsFragment };

    if (!product?.id) {
      return NextResponse.json({ error: 'Missing product' }, { status: 400 });
    }

    const currentWishlist = await getWishlist();
    const isWishlisted = currentWishlist.some((item) => item.id === product.id);

    if (isWishlisted) {
      return NextResponse.json(
        { error: true, message: 'Product already in wishlist' },
        { status: 400 },
      );
    }

    const newWishList = [...currentWishlist, product];
    const result = await updateWishlistMetafields(newWishList, user.id);

    if (result.success && result.data) {
      return NextResponse.json(
        {
          message: 'Product correctly added to wishlist',
          data: result.data,
          success: true,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        },
      );
    }

    return NextResponse.json(
      {
        error: true,
        message: result.message || "Couldn't add product to user wishlist",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error('POST /api/wishlist error:', error);
    const status = getWishlistErrorStatus(error);
    return NextResponse.json(
      {
        error: true,
        message: error instanceof Error ? error.message : 'Failed to add product to wishlist',
      },
      { status },
    );
  }
}
