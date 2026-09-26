import 'server-only';

import type { Locale } from '@/i18n/routing';
import { storefrontSdk } from '@/shopify';

/**
 * Locale-aware Storefront SDK for a route.
 *
 * The locale is passed in rather than read from a request header: it comes from
 * the route segment, so it is a constant for the whole render and the cached
 * fetch scopes stay cacheable. Passing it in also keeps dynamic reads out of
 * React's render path, which is what allows each locale to be prerendered.
 */
export const getStorefront = async (locale: Locale) => storefrontSdk('public', locale);
