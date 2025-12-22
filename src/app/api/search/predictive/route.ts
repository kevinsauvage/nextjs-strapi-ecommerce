import { type NextRequest, NextResponse } from 'next/server';

import { storefrontSdk } from '@/shopify';

export const dynamic = 'force-dynamic'; // Search queries are dynamic

export async function GET(request: NextRequest) {
  const {searchParams} = request.nextUrl;
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ predictiveSearch: null }, { status: 200 });
  }

  const trimmedQuery = query.trim();

  try {
    const response = await storefrontSdk().predictiveSearch({
      query: trimmedQuery,
    });

    if (!response) {
      return NextResponse.json({ predictiveSearch: null }, { status: 200 });
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Predictive search error:', error);

    if (
      error instanceof Error &&
      (error.message.includes('rate limit') ||
        error.message.includes('429') ||
        error.message.includes('Too Many Requests'))
    ) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch predictive search results' },
      { status: 500 },
    );
  }
}
