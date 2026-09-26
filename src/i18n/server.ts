import 'server-only';

import type { Route } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { createTranslator } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { loadMessages, type Messages } from './messages';
import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
  LOCALE_HEADER,
  localizedPath,
  type RoutePath,
  SHOPIFY_LANGUAGE,
} from './routing';

/**
 * Locale for the current request, read from the header `src/proxy.ts` sets.
 *
 * Only for dynamic contexts — server actions, route handlers. Anything that
 * renders a page should use {@link localeFromParams}: reading a request header
 * opts the page out of prerendering, which is exactly what the `[locale]` segment
 * exists to avoid.
 */
export const getCurrentLocale = async (): Promise<Locale> => {
  try {
    const headerStore = await headers();
    const requested = headerStore.get(LOCALE_HEADER);

    if (isLocale(requested)) return requested;
  } catch {
    // No request scope — fall through.
  }

  return DEFAULT_LOCALE;
};

/**
 * Locale for a page rendered under the `[locale]` segment.
 *
 * The segment is part of the route, so it is a constant for the whole render:
 * passing it down keeps the page cacheable and prerenderable per language. An
 * unsupported value (`/de/...`) is a 404 rather than a silently English page —
 * the proxy normalises the segment first, so this only guards direct matches.
 */
export const localeFromParams = async <P extends { locale: string }>(
  params: Promise<P>,
): Promise<Locale> => {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return locale;
};

/**
 * Translator bound to one message namespace and one locale.
 *
 * `raw` returns a whole message (the arrays and objects some sections hold)
 * instead of a formatted string.
 */
export type MessageTranslator = {
  (key: string, values?: Record<string, string | number>): string;
  raw: <T>(key: string) => T;
};

/**
 * Publishes the locale to `next-intl` for the current render.
 *
 * Without this, any `next-intl` server API falls back to reading the request
 * locale from a header, which under Cache Components opts the whole route out of
 * prerendering. Because the locale is part of the route here, it is known before
 * rendering starts, so it can be declared up front — this is what makes each
 * language statically renderable. Safe to call more than once per request.
 */
export const declareLocale = (locale: Locale): void => setRequestLocale(locale);

/**
 * Translator for a message namespace in a given locale.
 *
 * The locale is an argument rather than a request lookup: `next-intl`'s own
 * server helpers read the request, and under Cache Components a request read
 * opts the page out of prerendering. The locale is already known from the route
 * segment, so passing it keeps every language statically renderable. Key
 * completeness across catalogs is enforced by `messages.test.ts`.
 */
export const getTranslations = (locale: Locale, namespace: keyof Messages): MessageTranslator => {
  // `createTranslator` resolves a fully qualified key path (`footer.title`) and
  // types it as a closed union of literal keys, which a namespace chosen at
  // runtime cannot produce. Widening the signature here keeps the public API
  // honest — the namespace is always a real key of the catalog, and catalog
  // completeness is enforced by `messages.test.ts`.
  const t = createTranslator({ locale, messages: loadMessages(locale) }) as unknown as {
    (key: string, values?: Record<string, string | number>): string;
    raw: (key: string) => unknown;
  };

  return Object.assign(
    (key: string, values?: Record<string, string | number>) => t(`${namespace}.${key}`, values),
    { raw: <T>(key: string) => t.raw(`${namespace}.${key}`) as T },
  );
};

/**
 * Shopify `LanguageCode` for a locale.
 *
 * Pass it to the shop queries that declare `$language` (`@inContext`) so
 * Shopify returns translated content — menus, pages, policies and metaobjects.
 * Only use it on those operations: an undeclared variable is a GraphQL error.
 */
export const contentLanguage = (locale: Locale): (typeof SHOPIFY_LANGUAGE)[Locale] =>
  SHOPIFY_LANGUAGE[locale];

/**
 * Redirects to an internal path, keeping the visitor in their language.
 *
 * `redirect()` only accepts a locale-prefixed `Route`, so this is the one place
 * that applies the prefix for a redirect — the navigation equivalent is
 * `LocalizedLink`.
 *
 * The explicit type annotation on the binding is required: TypeScript only
 * treats a call as unreachable for control-flow analysis when the callee is a
 * `const` with a declared `never` return type.
 */
export const redirectToPath: (path: RoutePath, locale: Locale) => never = (path, locale) =>
  redirect(localizedPath(locale, path) as Route);
