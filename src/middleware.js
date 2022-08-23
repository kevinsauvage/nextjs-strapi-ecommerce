import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname, origin, locale } = nextUrl;

  // Early return if it is a public file such as an image
  if (PUBLIC_FILE.test(pathname)) return undefined;

  // Early return if this is an api route
  if (pathname.includes('/api')) return undefined;

  // Get user auth cookies
  const cookieJWT = cookies.get('jwt');

  if (
    cookieJWT &&
    (pathname.includes('/login') || pathname.includes('/register'))
  ) {
    return NextResponse.redirect(`${origin}/${locale || 'en'}/profile`);
  }

  if (cookieJWT) return NextResponse.next();

  if (pathname.includes('/profile')) {
    return NextResponse.redirect(`${origin}/${locale || 'en'}/login`);
  }

  return undefined;
}

export default middleware;
