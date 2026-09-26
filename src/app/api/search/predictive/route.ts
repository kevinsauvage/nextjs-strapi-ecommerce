import { type NextRequest, NextResponse } from 'next/server';

import { DEFAULT_LOCALE, isLocale } from '@/i18n/routing';
import { reportError } from '@/lib/logger';
import { getClientIp } from '@/lib/server/client-ip';
import { isRateLimited } from '@/lib/server/rate-limit';
import { getStorefront } from '@/lib/server/storefront';

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;
const RATE_LIMIT_TOKENS = 30;
const RATE_LIMIT_WINDOW = '1 m';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ data: { predictiveSearch: null }, success: true });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: 'Query too long', message: 'Search query is too long.' },
      { status: 400 },
    );
  }

  const ip = await getClientIp();
  // Deliberately fail-open: this is a read-only catalog path, so an Upstash
  // outage must degrade to unthrottled search rather than break browsing.
  // (All mutation buckets use `{ failClosed: true }` instead.)
  if (
    await isRateLimited('search:predictive', ip, RATE_LIMIT_TOKENS, RATE_LIMIT_WINDOW, {
      failClosed: false,
    })
  ) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Rate limit exceeded. Please try again in a moment.',
      },
      { status: 429 },
    );
  }

  try {
    // The proxy opts `/api` out of its matcher, so the locale arrives as a query
    // parameter from the client (`Search.tsx`) rather than the request header.
    // It is part of the URL, so the CDN cache key already varies by language.
    const requestedLocale = request.nextUrl.searchParams.get('locale');
    const locale = isLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE;
    const response = await (await getStorefront(locale)).predictiveSearch({ query });

    if (!response) {
      return NextResponse.json({ data: { predictiveSearch: null }, success: true });
    }

    return NextResponse.json(
      { data: response, success: true },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  } catch (error) {
    // Never echo the raw error message: it can leak Shopify/GraphQL internals.
    reportError('GET /api/search/predictive', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictive search results' },
      { status: 500 },
    );
  }
}
