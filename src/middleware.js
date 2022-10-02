import { NextResponse } from 'next/server';
import routes from './data/routes';

const PUBLIC_FILE = /\.(.*)$/;

function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname, origin } = nextUrl;

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

      console.log(url, 'next url');
      // Get user auth cookies
      const cookieShopify = cookies.get('shopify_token');

      console.log(cookieShopify, 'cookieShopify tokens');

      // Cannot access auth page if already login
      if (cookieShopify && pathname.includes('/auth')) {
        console.log('Cannot access auth page if already login');

        return NextResponse.redirect(`${origin}${routes.account}`);
      }

      // Cannot access account if not login
      if (!cookieShopify && pathname.includes('/account')) {
        console.log(' Cannot access account if not login');
        return NextResponse.redirect(`${origin}${routes.login}`);
      }
      console.log('next');
      return NextResponse.next();
    }
  }

  url.pathname = '/api/auth';

  return NextResponse.rewrite(url);
}

export default middleware;
