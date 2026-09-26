import { getReadableCookieOptions } from '@/utils/cookie-security';

import { type Locale, LOCALE_COOKIE } from './routing';

/**
 * Browser-side locale persistence.
 *
 * The proxy never writes this cookie: it only holds an *explicit* visitor
 * choice, so an anonymous first visit stays cookie-free and CDN-cacheable.
 */

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const writeLocaleCookie = (locale: Locale): void => {
  if (typeof document === 'undefined') return;

  // Reuses the server cookie policy so the locale cookie shares the domain,
  // path, `SameSite` and `Secure` attributes of every other site cookie.
  const { domain, maxAge, path, sameSite, secure } = getReadableCookieOptions({
    maxAge: ONE_YEAR_SECONDS,
  });

  const parts = [
    `${LOCALE_COOKIE}=${encodeURIComponent(locale)}`,
    `Max-Age=${maxAge}`,
    `Path=${path}`,
    `SameSite=${sameSite}`,
  ];

  if (domain) parts.push(`Domain=${domain}`);
  if (secure) parts.push('Secure');

  document.cookie = parts.join('; ');
};
