import { NextResponse } from 'next/server';
import nookies from 'nookies';

const PUBLIC_FILE = /\.(.*)$/;

function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname, origin, locale } = nextUrl;

  // Early return if it is a public file such as an image
  if (PUBLIC_FILE.test(pathname)) return undefined;

  // Early return if this is an api route
  if (pathname.includes('/api')) return undefined;

  // Get user auth cookies
  const cookieShopify = cookies.get('shopify_token');

  console.log(cookieShopify, 'middleware');

  const cookiesShopifyExpires = cookies.get('shopify_token_expires');

  console.log(cookiesShopifyExpires, 'middleware');

  const isCookieExpired =
    new Date(cookiesShopifyExpires).getDate() > new Date().getDate();

  if (cookiesShopifyExpires) {
    if (new Date(cookiesShopifyExpires).getDate() < new Date().getDate() - 1) {
      // TODO = REFRESH TOKEN
    } else if (isCookieExpired) {
      nookies.destroy(request, 'shopify_token');
      nookies.destroy(request, 'shopify_token_expires');
    }
  }

  if (
    cookieShopify &&
    (pathname.includes('/login') || pathname.includes('/register'))
  ) {
    return NextResponse.redirect(`${origin}/${locale || 'en'}/profile`);
  }

  if (cookieShopify) return NextResponse.next();

  if (pathname.includes('/profile')) {
    return NextResponse.redirect(`${origin}/${locale || 'en'}/login`);
  }

  return undefined;
}

export default middleware;
