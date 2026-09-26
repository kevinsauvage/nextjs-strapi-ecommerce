/**
 * Locale routing primitives shared by the proxy, server components and client
 * components. Deliberately framework-free so it can be imported from the
 * edge/proxy runtime as well as the React tree.
 */

export const LOCALES = ['en', 'es', 'fr'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Readable cookie (no secret) so the client switcher and the proxy agree. */
export const LOCALE_COOKIE = 'site-locale';

/**
 * Request header the proxy sets so server components, the Storefront client and
 * `next-intl` all read one resolved locale per request.
 */
export const LOCALE_HEADER = 'x-shop-locale';

/** HTML `lang` attribute value. */
export const HTML_LANG: Record<Locale, string> = { en: 'en', es: 'es', fr: 'fr' };

/** `Accept-Language` / BCP-47 tag sent to the Storefront API. */
export const ACCEPT_LANGUAGE: Record<Locale, string> = {
  en: 'en-GB',
  es: 'es-ES',
  fr: 'fr-FR',
};

/** Shopify `LanguageCode` enum value, used by `@inContext` where required. */
export const SHOPIFY_LANGUAGE = { en: 'EN', es: 'ES', fr: 'FR' } as const;

/** `og:locale` value. */
export const OG_LOCALE: Record<Locale, string> = { en: 'en_GB', es: 'es_ES', fr: 'fr_FR' };

/** Endonyms — a language picker is always shown in the language's own name. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

/**
 * Path helpers for locale-prefixed routing.
 *
 * English is the default locale and is served from the root (`/collections`),
 * the others from a prefix (`/es/collections`). The proxy rewrites the root form
 * to `/en/...` internally, so both URLs are the same route — see `src/proxy.ts`.
 */

/**
 * An internal path, without a locale segment: `/collections/dogs`.
 *
 * Every route is served under `[locale]`, so these are the *canonical* form
 * rather than a literal Next `Route`. `localizedPath` turns one into a URL for a
 * given language, and `LocalizedLink` is where that happens for navigation.
 */
export type RoutePath = `/${string}`;

/** Splits `?query` and `#hash` off a path, keeping their order. */
const splitSuffix = (path: string): [pathname: string, suffix: string] => {
  const index = path.search(/[?#]/);

  if (index === -1) return [path, ''];

  return [path.slice(0, index), path.slice(index)];
};

/**
 * Paths that are not ours: absolute URLs, protocol-relative URLs, `mailto:`,
 * `tel:` and bare fragments must never be rewritten into a locale prefix.
 */
export const isExternalOrAbsolutePath = (path: string): boolean =>
  path.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('#');

/** Strips a leading locale segment, returning the path and the locale found. */
export const splitLocalePrefix = (
  pathname: string,
): { locale: Locale | null; pathname: string } => {
  const [base, suffix] = splitSuffix(pathname);
  const [first, ...rest] = base.split('/').filter(Boolean);

  if (isLocale(first)) {
    return { locale: first, pathname: `/${rest.join('/')}${suffix}` };
  }

  return { locale: null, pathname };
};

/**
 * `/es/collections` for `es`, `/collections` for the default locale.
 *
 * Idempotent: an existing locale segment is replaced rather than stacked, so a
 * caller can hand it an already-prefixed path without stripping it first.
 */
export const localizedPath = (locale: Locale, path: string): string => {
  if (isExternalOrAbsolutePath(path)) return path;

  const [rawPath, suffix] = splitSuffix(path.startsWith('/') ? path : `/${path}`);
  const unprefixed = splitLocalePrefix(rawPath).pathname;
  const clean = unprefixed === '/' ? '' : unprefixed.replace(/\/+$/, '');
  const prefixed = locale === DEFAULT_LOCALE ? clean : `/${locale}${clean}`;

  return `${prefixed || '/'}${suffix}`;
};

/**
 * `hreflang` alternates for one canonical path: every language plus
 * `x-default`. Keys are the HTML `lang` values; values are relative unless a
 * `baseUrl` is given. Shared by `generateMetadata` and the sitemap so the two
 * never drift.
 */
export const localeAlternates = (path: string, baseUrl = ''): Record<string, string> =>
  Object.fromEntries([
    ...LOCALES.map((locale) => [HTML_LANG[locale], `${baseUrl}${localizedPath(locale, path)}`]),
    ['x-default', `${baseUrl}${localizedPath(DEFAULT_LOCALE, path)}`],
  ]);

/**
 * Picks the best supported locale from an `Accept-Language` header.
 *
 * Parses quality values (`es-ES,es;q=0.9,fr;q=0.8`) and falls back to the base
 * subtag, so `es-MX` resolves to `es` and `fr-CA` to `fr`.
 */
export const matchLocaleFromAcceptLanguage = (header: string | null | undefined): Locale | null => {
  if (!header) return null;

  const candidates = header
    .split(',')
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(';');
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith('q='))
        ?.slice(2);

      return { tag: (rawTag ?? '').trim().toLowerCase(), weight: quality ? Number(quality) : 1 };
    })
    .filter((entry) => entry.tag.length > 0 && Number.isFinite(entry.weight))
    .sort((a, b) => b.weight - a.weight);

  for (const { tag } of candidates) {
    if (isLocale(tag)) return tag;

    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
  }

  return null;
};

/**
 * Resolution order: explicit choice (cookie) → visitor preference → default.
 * An explicit choice always wins, so a Spanish speaker who once picked English
 * keeps English regardless of their browser.
 */
export const resolveLocale = ({
  cookie,
  acceptLanguage,
}: {
  cookie?: string | null | undefined;
  acceptLanguage?: string | null;
}): Locale => {
  if (isLocale(cookie)) return cookie;

  return matchLocaleFromAcceptLanguage(acceptLanguage) ?? DEFAULT_LOCALE;
};
