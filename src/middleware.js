import { NextResponse } from 'next/server';
import config from './config';

const PUBLIC_FILE = /\.(.*)$/;

const checkBasicAuth = (req) => {
  const basicAuth = req?.headers?.get('authorization');
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (user === 'kevin' && pwd === '50625062') return true;
    return false;
  }
  return false;
};

function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname, origin } = nextUrl;

  if (!checkBasicAuth(request)) {
    const url = nextUrl;
    url.pathname = '/api/auth';
    return NextResponse.rewrite(url);
  }

  // Early return if it is a public file such as an image
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return null;
  }

  // Get user auth cookies
  const cookieShopify = cookies.get('shopifyToken');
  // Cannot access account if not login
  if (!cookieShopify && pathname.startsWith('/account')) {
    return NextResponse.redirect(`${origin}${config.routes.login}`);
  }

  // Cannot access auth page if already login
  if (cookieShopify && pathname.startsWith('/auth')) {
    return NextResponse.redirect(`${origin}${config.routes.account}`);
  }

  return NextResponse.next();
}

export default middleware;
