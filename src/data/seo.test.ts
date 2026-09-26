import { getSeo, type Seo } from './seo';

import { describe, expect, it } from 'vitest';

/** Recursively collects the dotted key paths of a metadata catalog. */
const keyPaths = (value: unknown, prefix = ''): string[] => {
  if (typeof value !== 'object' || value === null) return [prefix];

  return Object.entries(value).flatMap(([key, entry]) =>
    keyPaths(entry, prefix ? `${prefix}.${key}` : key),
  );
};

const readPath = (catalog: Seo, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], catalog);

describe('seo', () => {
  it('exposes the home, cart and search entries in English', () => {
    const seo = getSeo('en');

    expect(seo.home.title).toBe('Premium Pet Products for Dogs & Cats');
    expect(seo.home.description).toContain('pet essentials');
    expect(seo.cart.title).toBe('Cart');
    expect(seo.search.title).toBe('Search');
    expect(seo.wishlist.title).toBe('Wishlist');
  });

  it('es and fr mirror every key of the English catalog', () => {
    const keys = keyPaths(getSeo('en'));

    for (const locale of ['es', 'fr'] as const) {
      const translated = keyPaths(getSeo(locale));
      const missing = keys.filter((key) => !translated.includes(key));

      expect(missing).toEqual([]);
    }
  });

  it('gives every section a non-empty title and description', () => {
    for (const locale of ['en', 'es', 'fr'] as const) {
      const seo = getSeo(locale);
      const sections: Array<{ title?: unknown; description?: unknown }> = [
        seo.account,
        seo.account.addresses,
        seo.account.orders,
        seo.account.update,
        seo.cart,
        seo.home,
        seo.pages.contact,
        seo.pages.privacy,
        seo.pages.refund,
        seo.pages.shipping,
        seo.pages.subscription,
        seo.pages.terms,
        seo.search,
        seo.wishlist,
      ];

      for (const section of sections) {
        expect(typeof section.title).toBe('string');
        expect((section.title as string).length).toBeGreaterThan(0);
        expect(typeof section.description).toBe('string');
        expect((section.description as string).length).toBeGreaterThan(0);
      }
    }
  });

  it('resolves nested paths in every locale', () => {
    for (const locale of ['en', 'es', 'fr'] as const) {
      expect(typeof readPath(getSeo(locale), 'pages.privacy.title')).toBe('string');
    }
  });

  it('falls back to English for an unknown locale', () => {
    expect(getSeo('de' as never).home.title).toBe('Premium Pet Products for Dogs & Cats');
  });
});
