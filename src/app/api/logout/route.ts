import { type NextRequest, NextResponse } from 'next/server';

import { delCookieAction } from '@/actions/cookiesActions';
import config from '@/config';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  try {
    await delCookieAction(config.cookies.shopifyToken);
    return NextResponse.json({ success: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to logout' },
      { status: 500 },
    );
  }
}

