import { NextResponse } from 'next/server';

import { createCartAction } from './actions/cartActions';
import { setDelegateTokenAction } from './actions/delegateTokenActions';
import globalConfig from './config';

const checkBasicAuth = (headers) => {
  const basicAuth = headers?.get('authorization');
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');
    return user === 'kevin' && pwd === '50625062';
  }
  return false;
};

async function middleware(request) {
  const { nextUrl, cookies, headers, url, ip } = request;
  const { searchParams, pathname } = nextUrl;

  if (!checkBasicAuth(headers)) {
    nextUrl.pathname = '/api/basicAuth';
    return NextResponse.rewrite(nextUrl);
  }

  const response = NextResponse.next();

  const userIp = ip || headers.get('x-forwarded-for')?.split(',')[0] || 'Unknown';

  response.cookies.set(globalConfig.cookies.userIp, userIp);
  response.cookies.set(globalConfig.cookies.url, url);
  response.cookies.set(globalConfig.cookies.searchParams, searchParams);

  await setDelegateTokenAction();
  await createCartAction();

  const cookieShopify = cookies.get(globalConfig.cookies.shopifyToken);

  // Private routes redirect
  if (!cookieShopify && pathname.startsWith(globalConfig.routes.account)) {
    return NextResponse.redirect(new URL(globalConfig.routes.login, url));
  }

  if (
    cookieShopify &&
    (pathname.startsWith(globalConfig.routes.login) ||
      pathname.startsWith(globalConfig.routes.register))
  ) {
    return NextResponse.redirect(new URL(globalConfig.routes.account, url));
  }

  return response;
}

export default middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
