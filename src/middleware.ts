import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createCartAction } from './actions/cartActions';
import { setDelegateTokenAction } from './actions/delegateTokenActions';
import globalConfig from './config';

const checkBasicAuth = (nextUrl: URL, cookies: RequestCookies) => {
  const authCookie = cookies.get('authorization');

  if (authCookie) {
    return authCookie.value === 'true';
  }

  const authorization = nextUrl?.searchParams.get('authorization');

  if (authorization) {
    const isAuthorized = authorization === 'true';
    if (isAuthorized) {
      cookies.set('authorization', 'true');
    }
    return isAuthorized;
  }
  return false;
};

async function middleware(request: NextRequest) {
  const { nextUrl, cookies, headers, url } = request;
  const { searchParams, pathname } = nextUrl;

  const response = NextResponse.next();

  if (checkBasicAuth(nextUrl, cookies)) {
    response.cookies.set('authorization', 'true');
  } else {
    nextUrl.pathname = '/api/basicAuth';
    return NextResponse.rewrite(nextUrl);
  }

  const userIp = headers.get('x-forwarded-for')?.split(',')[0] || 'Unknown';

  response.cookies.set(globalConfig.cookies.userIp, userIp);
  response.cookies.set(globalConfig.cookies.url, url);
  response.cookies.set(globalConfig.cookies.searchParams, searchParams.toString());

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
