import { NextResponse } from 'next/server';
import { setCookie } from 'nookies';
import routes from './data/routes';
import { refreshToken } from './lib/shopify/customer';

const PUBLIC_FILE = /\.(.*)$/;
// const expireAt = 1 * 24 * 60 * 60;

function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname, origin, locale } = nextUrl;

  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (user === 'kevin' && pwd === '50625062') {
      // Early return if it is a public file such as an image
      if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(request.nextUrl.pathname)
      ) {
        return null;
      }
      const response = NextResponse.next();

      // Get user auth cookies
      const cookieShopify = cookies.get('shopify_token');
      const cookiesShopifyExpires = cookies.get('shopify_token_expires');

      if (cookieShopify) {
        const expireInMilliseconds = new Date(cookiesShopifyExpires).getTime();
        const todayInMilliseconds = new Date().getTime();

        console.log('expireInMilliseconds', todayInMilliseconds);
        console.log('todayInMilliseconds', todayInMilliseconds);
        console.log(
          todayInMilliseconds - expireInMilliseconds,
          'today - expireInMilliseconds '
        );

        // Refresh the cookies 1h before they expire
        if (expireInMilliseconds < todayInMilliseconds - 3600) {
          console.log('refresh token');

          refreshToken(cookieShopify).then((res) => {
            if (res.errors.length === 0) {
              const expireTime = new Date(res.refresh.expiresAt).getTime();

              setCookie(
                { response },
                'shopify_token',
                res.refresh.accessToken,
                {
                  httpOnly: true,
                  secure: process.env.NODE_ENV !== 'development',
                  maxAge: expireTime,
                  path: '/',
                }
              );

              setCookie(
                { response },
                'shopify_token_expires',
                res.refresh.expireTime,
                {
                  httpOnly: true,
                  secure: process.env.NODE_ENV !== 'development',
                  maxAge: expireTime,
                  path: '/',
                }
              );
            }
          });
        }

        // If is not expired then go to profile page
        if (pathname.includes('/login') || pathname.includes('/register')) {
          return NextResponse.redirect(
            `${origin}/${locale || 'en'}${routes.base.profile}`
          );
        }
      } else if (pathname === '/account') {
        return NextResponse.redirect(
          `${origin}/${locale || 'en'}${routes.base.login}`
        );
      }

      return response;
    }
  }

  url.pathname = '/api/auth';

  return NextResponse.rewrite(url);
}

export default middleware;
