import { NextResponse } from 'next/server';
import { setCookie } from 'nookies';
import routes from './data/routes';
import { refreshToken } from './lib/shopify/customer';

const PUBLIC_FILE = /\.(.*)$/;
const expireAt = 1 * 24 * 60 * 60;

function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname, origin, locale } = nextUrl;

  // Early return if it is a public file such as an image
  if (PUBLIC_FILE.test(pathname)) return undefined;

  // Early return if this is an api route
  if (pathname.includes('/api')) return undefined;

  // Get user auth cookies
  const cookieShopify = cookies.get('shopify_token');

  // Get expire in Date format
  const cookiesShopifyExpires = cookies.get('shopify_token_expires');

  const response = NextResponse.next();

  if (cookieShopify && cookiesShopifyExpires) {
    const expireInMilliseconds = new Date(cookiesShopifyExpires).getTime();
    const todayInMilliseconds = new Date().getTime();

    const isExpired = expireInMilliseconds > todayInMilliseconds;

    // Refresh the cookies 1h before they expire
    if (expireInMilliseconds > todayInMilliseconds - 3600 && !isExpired) {
      refreshToken(cookieShopify).then((res) => {
        if (res.errors.length === 0) {
          setCookie({ response }, 'shopify_token', res.refresh.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: expireAt,
            path: '/',
          });
          setCookie(
            { response },
            'shopify_token_expires',
            res.refresh.expiresAt,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV !== 'development',
              maxAge: expireAt,
              path: '/',
            }
          );
        }
      });
    }

    // If is not expired then go to profile page
    if (
      pathname.includes('/login') ||
      (pathname.includes('/register') && !isExpired)
    ) {
      return NextResponse.redirect(
        `${origin}/${locale || 'en'}${routes.base.profile}`
      );
    }
    // If is expired then redirect to the login
    if (pathname.includes('/profile') && isExpired) {
      return NextResponse.redirect(
        `${origin}/${locale || 'en'}${routes.base.login}`
      );
    }
  }

  // If there is no cookie then redirect to the login
  if (pathname.includes('/profile') && !cookieShopify) {
    return NextResponse.redirect(
      `${origin}/${locale || 'en'}${routes.base.login}`
    );
  }

  return response;
}

export default middleware;
