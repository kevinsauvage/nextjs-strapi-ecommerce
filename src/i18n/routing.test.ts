import {
  DEFAULT_LOCALE,
  isLocale,
  localeAlternates,
  LOCALES,
  localizedPath,
  matchLocaleFromAcceptLanguage,
  resolveLocale,
  splitLocalePrefix,
} from './routing';

import { describe, expect, it } from 'vitest';

describe('i18n routing', () => {
  describe('localizedPath', () => {
    it('leaves the default locale unprefixed', () => {
      expect(localizedPath('en', '/collections')).toBe('/collections');
      expect(localizedPath('en', '/collections/dogs')).toBe('/collections/dogs');
    });

    it('prefixes the other locales', () => {
      expect(localizedPath('es', '/collections')).toBe('/es/collections');
      expect(localizedPath('fr', '/collections/dogs')).toBe('/fr/collections/dogs');
    });

    it('handles the root path', () => {
      expect(localizedPath('en', '/')).toBe('/');
      expect(localizedPath('es', '/')).toBe('/es');
    });

    it('replaces an existing prefix rather than stacking one', () => {
      expect(localizedPath('fr', '/es/collections')).toBe('/fr/collections');
      expect(localizedPath('en', '/es/collections')).toBe('/collections');
    });

    it('keeps the query string and the hash outside the prefix', () => {
      expect(localizedPath('es', '/search?searchQuery=collar')).toBe(
        '/es/search?searchQuery=collar',
      );
      expect(localizedPath('es', '/collections#top')).toBe('/es/collections#top');
    });

    it('normalizes a missing leading slash and trailing slashes', () => {
      expect(localizedPath('es', 'collections')).toBe('/es/collections');
      expect(localizedPath('es', '/collections/')).toBe('/es/collections');
    });

    it('never prefixes external, protocol-relative or bare-fragment targets', () => {
      for (const path of [
        'https://example.com/page',
        '//cdn.example.com/x',
        'mailto:hello@example.com',
        'tel:+33123456789',
        '#main',
      ]) {
        expect(localizedPath('es', path)).toBe(path);
      }
    });
  });

  describe('splitLocalePrefix', () => {
    it('returns the locale and the remaining path', () => {
      expect(splitLocalePrefix('/es/collections/dogs')).toEqual({
        locale: 'es',
        pathname: '/collections/dogs',
      });
    });

    it('reports no locale for an unprefixed path', () => {
      expect(splitLocalePrefix('/collections/dogs')).toEqual({
        locale: null,
        pathname: '/collections/dogs',
      });
    });

    it('does not treat an unknown first segment as a locale', () => {
      expect(splitLocalePrefix('/de/collections')).toEqual({
        locale: null,
        pathname: '/de/collections',
      });
    });

    it('keeps the query string attached to the returned path', () => {
      expect(splitLocalePrefix('/fr/search?q=collar')).toEqual({
        locale: 'fr',
        pathname: '/search?q=collar',
      });
    });

    it('handles a bare locale segment and the root', () => {
      expect(splitLocalePrefix('/es')).toEqual({ locale: 'es', pathname: '/' });
      expect(splitLocalePrefix('/')).toEqual({ locale: null, pathname: '/' });
    });

    it('round-trips with localizedPath', () => {
      for (const locale of LOCALES) {
        expect(localizedPath(locale, splitLocalePrefix(`/es/collections`).pathname)).toBe(
          localizedPath(locale, '/collections'),
        );
      }
    });
  });

  describe('isLocale', () => {
    it('accepts every supported locale', () => {
      for (const locale of LOCALES) {
        expect(isLocale(locale)).toBe(true);
      }
    });

    it('rejects unknown, empty and non-string values', () => {
      for (const value of ['de', '', 'EN', null, undefined, 42, {}]) {
        expect(isLocale(value)).toBe(false);
      }
    });
  });

  describe('matchLocaleFromAcceptLanguage', () => {
    it('matches an exact locale', () => {
      expect(matchLocaleFromAcceptLanguage('es')).toBe('es');
    });

    it('falls back to the base subtag for a regional variant', () => {
      expect(matchLocaleFromAcceptLanguage('es-MX')).toBe('es');
      expect(matchLocaleFromAcceptLanguage('fr-CA')).toBe('fr');
    });

    it('respects quality values, preferring the highest', () => {
      expect(matchLocaleFromAcceptLanguage('es;q=0.4,fr;q=0.9,en;q=0.5')).toBe('fr');
    });

    it('keeps the header order when every candidate has q=1', () => {
      expect(matchLocaleFromAcceptLanguage('fr,es,en')).toBe('fr');
    });

    it('ignores unsupported languages', () => {
      expect(matchLocaleFromAcceptLanguage('de,it,nl')).toBeNull();
    });

    it('returns null for a missing header', () => {
      expect(matchLocaleFromAcceptLanguage(null)).toBeNull();
      expect(matchLocaleFromAcceptLanguage('')).toBeNull();
      expect(matchLocaleFromAcceptLanguage(undefined)).toBeNull();
    });
  });

  describe('resolveLocale', () => {
    it('prefers an explicit cookie choice over Accept-Language', () => {
      expect(resolveLocale({ acceptLanguage: 'fr', cookie: 'es' })).toBe('es');
    });

    it('uses Accept-Language when there is no explicit choice', () => {
      expect(resolveLocale({ acceptLanguage: 'fr-FR,fr;q=0.9', cookie: null })).toBe('fr');
    });

    it('falls back to English when the preference is unsupported', () => {
      expect(resolveLocale({ acceptLanguage: 'ja-JP', cookie: undefined })).toBe(DEFAULT_LOCALE);
    });

    it('ignores a corrupted cookie value', () => {
      expect(resolveLocale({ acceptLanguage: 'es', cookie: 'not-a-locale' })).toBe('es');
      expect(resolveLocale({ cookie: 'not-a-locale' })).toBe(DEFAULT_LOCALE);
    });
  });

  describe('localeAlternates', () => {
    it('maps every language plus x-default to a relative path', () => {
      expect(localeAlternates('/collections/dogs')).toEqual({
        en: '/collections/dogs',
        es: '/es/collections/dogs',
        fr: '/fr/collections/dogs',
        'x-default': '/collections/dogs',
      });
    });

    it('prefixes an absolute base URL', () => {
      expect(localeAlternates('/', 'https://shop.example')).toEqual({
        en: 'https://shop.example/',
        es: 'https://shop.example/es',
        fr: 'https://shop.example/fr',
        'x-default': 'https://shop.example/',
      });
    });
  });
});
