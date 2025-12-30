import { type NextRequest, NextResponse } from 'next/server';

import {
  getWishlist,
  getWishlistErrorStatus,
  getWishlistIds,
  requireWishlistAuth,
  updateWishlistMetafields,
  WISHLIST_MAX_ITEMS,
} from '@/lib/wishlist';
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
    const { productId } = body as { productId: string };

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid product ID' }, { status: 400 });
    }

    const currentWishlistIds = await getWishlistIds();
    
    if (currentWishlistIds.includes(productId)) {
      return NextResponse.json(
        { error: true, message: 'Product already in wishlist' },
        { status: 400 },
      );
    }

    if (currentWishlistIds.length >= WISHLIST_MAX_ITEMS) {
      return NextResponse.json(
        {
          error: true,
          message: `Wishlist is full. Maximum ${WISHLIST_MAX_ITEMS} items allowed.`,
        },
        { status: 400 },
      );
    }

    const newWishlistIds = [...currentWishlistIds, productId];
    const result = await updateWishlistMetafields(newWishlistIds, user.id);

    if (result.success && result.data !== undefined) {
      // Resolve products to return full data
      const wishlist = await getWishlist();
      return NextResponse.json(
        {
          message: 'Product correctly added to wishlist',
          data: wishlist,
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
