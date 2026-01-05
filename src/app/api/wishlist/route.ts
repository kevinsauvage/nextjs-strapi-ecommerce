import { type NextRequest } from 'next/server';

import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  HTTP_STATUS,
} from '@/lib/api-responses';
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
    return createSuccessResponse(wishlist);
  } catch (error) {
    return handleApiError('GET /api/wishlist', error, 'Failed to fetch wishlist');
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireWishlistAuth();
    const user = await getUser();

    if (!user?.id) {
      return createErrorResponse('User not found', { status: HTTP_STATUS.NOT_FOUND });
    }

    const body = await request.json();
    const { productId } = body as { productId: string };

    if (!productId || typeof productId !== 'string') {
      return createErrorResponse('Missing or invalid product ID', { status: HTTP_STATUS.BAD_REQUEST });
    }

    const currentWishlistIds = await getWishlistIds();
    
    if (currentWishlistIds.includes(productId)) {
      return createErrorResponse('Product already in wishlist', { status: HTTP_STATUS.BAD_REQUEST });
    }

    if (currentWishlistIds.length >= WISHLIST_MAX_ITEMS) {
      return createErrorResponse('Wishlist is full', {
        message: `Wishlist is full. Maximum ${WISHLIST_MAX_ITEMS} items allowed.`,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const newWishlistIds = [...currentWishlistIds, productId];
    const result = await updateWishlistMetafields(newWishlistIds, user.id);

    if (!result.success || result.data === undefined) {
      return createErrorResponse("Couldn't add product to user wishlist", {
        message: result.message || "Couldn't add product to user wishlist",
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      });
    }

    const wishlist = await getWishlist();
    return createSuccessResponse(wishlist, {
      message: 'Product correctly added to wishlist',
      noCache: true,
    });
  } catch (error) {
    const status = getWishlistErrorStatus(error);
    return createErrorResponse('Failed to add product to wishlist', {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      status,
    });
  }
}
