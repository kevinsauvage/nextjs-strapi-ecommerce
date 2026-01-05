import { type NextRequest } from 'next/server';

import { delCookieAction } from '@/actions/cookiesActions';
import config from '@/config';
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  HTTP_STATUS,
  safeLogError,
} from '@/lib/api-responses';
import { storefrontSdk } from '@/shopify';
import { clearShopifyToken, getShopifyToken } from '@/utils/shopify';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  try {
    const token = await getShopifyToken();
    if (token) {
      try {
        await storefrontSdk('no-store').customerAccessTokenDelete({
          customerAccessToken: token,
        });
      } catch (error) {
        safeLogError('POST /api/logout - token deletion', error);
      }
    }

    await clearShopifyToken();
    await delCookieAction(config.cookies.delegateToken);

    return createSuccessResponse({ success: 'Logged out successfully' });
  } catch (error) {
    return handleApiError('POST /api/logout', error, 'Failed to logout');
  }
}

