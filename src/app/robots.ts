import type { MetadataRoute } from 'next';

import { LOCALES, localizedPath } from '@/i18n/routing';
import { getBaseUrl } from '@/lib/server/metadata';

/** Paths with no crawl value: private, per-visitor or generated on demand. */
const DISALLOWED = [
  '/account', // Private account overview (bare route)
  '/account/', // Private user account pages (orders, addresses, etc.)
  '/api/', // API routes (not meant for search engines)
  '/search', // Dynamic search pages (not useful for SEO)
  '/cart', // Cart pages are user-specific and not useful for SEO
  '/wishlist', // Per-browser wishlist + user-generated shared links are noindexed
  '/login', // Auth pages add no crawl value
  '/register',
  '/recover',
  '/reset_password',
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Every page is served in every language, so each rule has to be repeated
      // for each locale prefix — otherwise `/es/cart` and `/fr/account` stay
      // crawlable while their English counterparts are blocked.
      disallow: LOCALES.flatMap((locale) => DISALLOWED.map((path) => localizedPath(locale, path))),
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
