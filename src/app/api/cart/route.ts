import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  HTTP_STATUS,
} from '@/lib/api-responses';
import { getCart } from '@/lib/cart';
import { getCartId } from '@/lib/cart-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cartId = await getCartId();
    if (!cartId) {
      return createErrorResponse('Cart not found', { status: HTTP_STATUS.NOT_FOUND });
    }

    const cart = await getCart(cartId);
    if (!cart) {
      throw new Error('Failed to fetch cart');
    }

    return createSuccessResponse(cart);
  } catch (error) {
    return handleApiError('GET /api/cart', error, 'Failed to fetch cart');
  }
}
