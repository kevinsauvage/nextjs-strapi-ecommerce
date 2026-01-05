import { type NextRequest } from 'next/server';

import {
  createErrorResponse,
  createSuccessResponse,
  HTTP_STATUS,
} from '@/lib/api-responses';
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
      return createErrorResponse('User not found', { status: HTTP_STATUS.NOT_FOUND });
    }

    const { productId: rawProductId } = await params;
    if (!rawProductId) {
      return createErrorResponse('Missing product ID', { status: HTTP_STATUS.BAD_REQUEST });
    }

    const productId = decodeURIComponent(rawProductId);
    const currentWishlistIds = await getWishlistIds();
    const newWishlistIds = currentWishlistIds.filter((id) => id !== productId);

    if (currentWishlistIds.length === newWishlistIds.length) {
      return createErrorResponse('Product not found in wishlist', { status: HTTP_STATUS.NOT_FOUND });
    }

    const result = await updateWishlistMetafields(newWishlistIds, user.id);

    if (!result.success || result.data === undefined) {
      return createErrorResponse('Something went wrong removing the product from the wishlist', {
        message: result.message || 'Something went wrong removing the product from the wishlist',
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      });
    }

    const wishlist = await getWishlist();
    return createSuccessResponse(wishlist, {
      message: 'Product correctly removed from wishlist',
      noCache: true,
    });
  } catch (error) {
    const status = getWishlistErrorStatus(error);
    return createErrorResponse('Failed to remove product from wishlist', {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      status,
    });
  }
}
