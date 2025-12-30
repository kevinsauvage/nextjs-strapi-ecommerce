import { type NextRequest, NextResponse } from 'next/server';

import {
  getWishlist,
  getWishlistErrorStatus,
  getWishlistIds,
  requireWishlistAuth,
  updateWishlistMetafields,
} from '@/lib/wishlist';
import { getUser } from '@/utils/users';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    await requireWishlistAuth();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { productId: rawProductId } = await params;

    if (!rawProductId) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const productId = decodeURIComponent(rawProductId);

    const currentWishlistIds = await getWishlistIds();
    const newWishlistIds = currentWishlistIds.filter((id) => id !== productId);

    if (currentWishlistIds.length === newWishlistIds.length) {
      return NextResponse.json(
        { error: true, message: 'Product not found in wishlist' },
        { status: 404 },
      );
    }

    const result = await updateWishlistMetafields(newWishlistIds, user.id);

    if (result.success && result.data !== undefined) {
      // Resolve products to return full data
      const wishlist = await getWishlist();
      return NextResponse.json(
        {
          message: 'Product correctly removed from wishlist',
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
        message: result.message || 'Something went wrong removing the product from the wishlist',
      },
      { status: 500 },
    );
  } catch (error) {
    console.error('DELETE /api/wishlist/[productId] error:', error);
    const status = getWishlistErrorStatus(error);
    return NextResponse.json(
      {
        error: true,
        message: error instanceof Error ? error.message : 'Failed to remove product from wishlist',
      },
      { status },
    );
  }
}
