import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  DEFAULT_LOCALE,
  type Locale,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  localizedPath,
  resolveLocale,
  splitLocalePrefix,
} from './i18n/routing';
import { isTokenExpired, renewCustomerToken, shouldRenewToken } from './lib/token-renewal';
import {
  getCookieDeleteOptions,
  getReadableCookieOptions,
  getSecureCookieOptions,
} from './utils/cookie-security';
import globalConfig from './config';

/**
 * Runs on every navigation. It normalises the locale segment, and manages
 * session state (token renewal and auth redirects). It never sets cookies on
 * anonymous catalog responses, so statically rendered pages stay cacheable at
 * the CDN.
 *
 * Cookie writes must also happen here (not while rendering server components),
 * which is why stale-token cleanup lives in this file.
 */

/** How the locale prefix of a request maps onto a response. */
type LocaleRouting = {
  /** Locale to use for this request. */
  locale: Locale;
  /**
   * Unprefixed path, without the query string (`/collections`, not
   * `/en/collections?page=2`). Kept separate so a rewrite or redirect only has
   * to set `pathname` and cannot accidentally encode the query into it.
   */
  pathname: string;
  /** True when the URL already carried a locale segment. */
  hasPrefix: boolean;
};

/**
 * Resolves the locale and the canonical unprefixed path.
 *
 * A locale in the path is authoritative — it is what makes each language
 * addressable and prerenderable. An unprefixed path means English, so it is
 * rewritten internally to `/en/...` and keeps the URL the visitor sees.
 */
const resolveLocaleRouting = (request: NextRequest): LocaleRouting => {
  const { locale: pathLocale, pathname: unprefixed } = splitLocalePrefix(request.nextUrl.pathname);

  if (pathLocale) return { locale: pathLocale, pathname: unprefixed, hasPrefix: true };

  // No prefix: honour an explicit choice or the visitor's `Accept-Language`, so
  // a Spanish or French first visit still lands on its own language. English
  // needs no redirect — it is served from the root.
  const locale = resolveLocale({
    acceptLanguage: request.headers.get('accept-language'),
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
  });

  return { locale, pathname: unprefixed, hasPrefix: false };
};

/**
 * Decides the response for a request. Extracted from `proxy` to keep that
 * function focused on session state.
 */
const chooseResponse = ({
  request,
  hasSession,
  isAccountRoute,
  isAuthRoute,
  isServerAction,
  locale,
  pathname,
  hasPrefix,
}: {
  request: NextRequest;
  hasSession: boolean;
  isAccountRoute: boolean;
  isAuthRoute: boolean;
  isServerAction: boolean;
  locale: LocaleRouting['locale'];
  pathname: string;
  hasPrefix: boolean;
}) => {
  // One resolved locale per request, forwarded to the server tree so the Store
  // front client, the API route handler and the server actions all agree.
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  const forward = { request: { headers } };

  if (isServerAction) return NextResponse.next(forward);

  // `/en/collections` and `/collections` are the same page: keep one canonical
  // URL by redirecting the prefixed English form to the root.
  if (hasPrefix && locale === DEFAULT_LOCALE) {
    const target = request.nextUrl.clone();
    target.pathname = pathname;

    return NextResponse.redirect(target);
  }

  // A non-English visitor arriving on an unprefixed URL is sent to their own
  // language, where the page is a normal, cacheable, indexable URL.
  if (!hasPrefix && locale !== DEFAULT_LOCALE) {
    const target = request.nextUrl.clone();
    target.pathname = localizedPath(locale, pathname);

    return NextResponse.redirect(target);
  }

  if (isAccountRoute && !hasSession) {
    const target = request.nextUrl.clone();
    target.pathname = localizedPath(locale, globalConfig.routes.login);

    return NextResponse.redirect(target);
  }

  if (isAuthRoute && hasSession) {
    const target = request.nextUrl.clone();
    target.pathname = localizedPath(locale, globalConfig.routes.account);

    return NextResponse.redirect(target);
  }

  // Unprefixed English: rewrite to the `/en/...` route internally so the
  // `[locale]` layout renders with a route param instead of a request header.
  if (!hasPrefix) {
    const target = request.nextUrl.clone();
    target.pathname = `/${DEFAULT_LOCALE}${pathname}`;

    return NextResponse.rewrite(target, forward);
  }

  return NextResponse.next(forward);
};

async function proxy(request: NextRequest) {
  const { cookies } = request;
  const { locale, pathname, hasPrefix } = resolveLocaleRouting(request);

  const cookieShopify = cookies.get(globalConfig.cookies.shopifyToken);
  const tokenExpiresAt = cookies.get(globalConfig.cookies.shopifyTokenExpire)?.value;

  // Exact match: `startsWith('/account')` alone also matches `/accounting`.
  const accountPath = splitLocalePrefix(pathname).pathname;
  const isAccountRoute =
    accountPath === globalConfig.routes.account ||
    accountPath.startsWith(`${globalConfig.routes.account}/`);
  const isAuthRoute =
    accountPath.startsWith(globalConfig.routes.login) ||
    accountPath.startsWith(globalConfig.routes.register);

  // Server Actions are POSTed to the route that declares them and expect an RSC
  // response. Redirecting one — e.g. a session that was cleared between the page
  // load and the submit, or a duplicate submit — makes the client's action
  // `fetch` follow the redirect and receive an HTML page, which surfaces as
  // "An unexpected response was received from the server" (E394) and skips the
  // action. Let actions through and let each one enforce its own auth.
  const isServerAction = request.method === 'POST' && request.headers.has('next-action');

  const hasToken = Boolean(cookieShopify?.value);
  const tokenExpired = isTokenExpired(tokenExpiresAt);

  // Validate/renew the token everywhere the result changes behaviour:
  //  - account routes, on every visit (a revoked token must not keep access
  //    just because its expiry cookie still looks fresh);
  //  - auth routes, to bounce signed-in visitors and to catch revoked tokens;
  //  - anywhere, once the token is inside its renewal window.
  // Anonymous catalog requests never pay for this round-trip.
  const shouldValidate =
    hasToken && (isAuthRoute || isAccountRoute || shouldRenewToken(tokenExpiresAt));

  const renewedToken = shouldValidate
    ? await renewCustomerToken(cookieShopify?.value as string)
    : null;

  const validationFailed = shouldValidate && !renewedToken;
  // A rejected token is unusable when it has already expired, or when an auth
  // decision required checking it (auth + account routes fail closed: a token
  // that cannot be renewed there is treated as stale so its cookies are
  // deleted and the visitor is bounced to login). Catalog requests stay
  // fail-open so a Shopify blip never breaks browsing.
  const hasStaleSession =
    hasToken && validationFailed && (tokenExpired || isAuthRoute || isAccountRoute);
  const hasSession = hasToken && !hasStaleSession;

  const response = chooseResponse({
    request,
    hasSession,
    isAccountRoute,
    isAuthRoute,
    isServerAction,
    locale,
    pathname,
    hasPrefix,
  });

  if (hasStaleSession) {
    const deleteOptions = getCookieDeleteOptions();
    response.cookies.delete({ name: globalConfig.cookies.shopifyToken, ...deleteOptions });
    response.cookies.delete({ name: globalConfig.cookies.shopifyTokenExpire, ...deleteOptions });
    response.cookies.delete({ name: globalConfig.cookies.sessionPresent, ...deleteOptions });
  }

  if (renewedToken) {
    const expiresAt = new Date(renewedToken.expiresAt);
    const tokenOptions = getSecureCookieOptions({ expires: expiresAt });

    response.cookies.set(globalConfig.cookies.shopifyToken, renewedToken.accessToken, tokenOptions);
    response.cookies.set(
      globalConfig.cookies.shopifyTokenExpire,
      expiresAt.toISOString(),
      tokenOptions,
    );
    response.cookies.set(
      globalConfig.cookies.sessionPresent,
      '1',
      getReadableCookieOptions({ expires: expiresAt }),
    );
  } else if (hasSession && !cookies.get(globalConfig.cookies.sessionPresent)) {
    // Repair sessions created before the marker existed so the client does not
    // resolve a signed-in visitor as signed out. Set once; no cookie on
    // anonymous catalog responses, which keeps static pages CDN-cacheable.
    response.cookies.set(
      globalConfig.cookies.sessionPresent,
      '1',
      getReadableCookieOptions({ maxAge: globalConfig.constants.cookieExpiryDays * 24 * 60 * 60 }),
    );
  }

  return response;
}

export default proxy;

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
