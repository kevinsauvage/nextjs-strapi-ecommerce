import { type NextRequest, NextResponse } from 'next/server';

import { delCookieAction } from '@/actions/cookiesActions';
import config from '@/config';
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
        console.warn('Failed to delete token on Shopify side:', error);
      }
    }

    await clearShopifyToken();

    await delCookieAction(config.cookies.delegateToken);

    return NextResponse.json({ success: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to logout' },
      { status: 500 },
    );
  }
}

