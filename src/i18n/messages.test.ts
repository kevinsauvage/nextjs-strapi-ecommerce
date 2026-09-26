import { en, es, fr, loadMessages } from './messages';
import { LOCALES } from './routing';

import { describe, expect, it } from 'vitest';

/** Recursively collects the dotted key paths of a message catalog. */
const keyPaths = (value: unknown, prefix = ''): string[] => {
  if (typeof value !== 'object' || value === null) return [prefix];

  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => keyPaths(entry, `${prefix}[${index}]`));
  }

  return Object.entries(value).flatMap(([key, entry]) =>
    keyPaths(entry, prefix ? `${prefix}.${key}` : key),
  );
};

const KEYS = keyPaths(en);
const CATALOGS = { es, fr };

describe('message catalogs', () => {
  it.each(LOCALES)('loads a catalog for %s', (locale) => {
    expect(loadMessages(locale)).toBeDefined();
  });

  it.each(Object.keys(CATALOGS) as Array<'es' | 'fr'>)(
    '%s mirrors every key of the English catalog',
    (locale) => {
      const translated = keyPaths(CATALOGS[locale]);
      const missing = KEYS.filter((key) => !translated.includes(key));

      expect(missing).toEqual([]);
    },
  );

  it('never ships a blank translation', () => {
    for (const locale of LOCALES) {
      for (const key of keyPaths(loadMessages(locale))) {
        const value = key
          .replace(/\[\d+\]/g, '')
          .split('.')
          .reduce<unknown>(
            (node, part) => (node as Record<string, unknown>)?.[part],
            loadMessages(locale),
          );

        expect(String(value).trim()).not.toBe('');
      }
    }
  });

  it('falls back to English for an unknown locale', () => {
    expect(loadMessages('de')).toBe(en);
    expect(loadMessages(undefined)).toBe(en);
  });
});
