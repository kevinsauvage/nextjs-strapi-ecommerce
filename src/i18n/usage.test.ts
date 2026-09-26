import { en } from './messages';

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guards against `MISSING_MESSAGE` at runtime.
 *
 * `messages.test.ts` proves the three catalogs mirror each other, but nothing
 * proves a component calls a key that exists at all: `t('footer.craftedWithCare')`
 * type-checks (the signature takes any string) and only fails when the page
 * renders. This walks every `useTranslations('ns')` / `getTranslations(locale, 'ns')`
 * binding and asserts each key it dereferences resolves in the English catalog.
 */

const SRC = join(process.cwd(), 'src');

/** Recursively collect every `.ts`/`.tsx` file under `src`, excluding tests. */
const sourceFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    if (!/\.tsx?$/.test(entry) || /\.test\.tsx?$/.test(entry)) return [];
    return [path];
  });

/** Dotted paths of every leaf message key in a catalog. */
const keyPaths = (value: unknown, prefix = ''): string[] => {
  if (typeof value !== 'object' || value === null) return [prefix];

  return Object.entries(value).flatMap(([key, entry]) =>
    keyPaths(entry, prefix ? `${prefix}.${key}` : key),
  );
};

const KEYS = new Set(keyPaths(en));

/**
 * Resolves `a.b` style paths against the catalog's leaf-key set. A path that
 * names an intermediate object or array (`home.perks`, `auth.benefits`) also
 * resolves — `raw()` reads whole subtrees.
 */
const has = (path: string): boolean => {
  const bare = path.replace(/\[\d+\]/g, '');

  return (
    KEYS.has(bare) ||
    [...KEYS].some((key) => key.startsWith(`${bare}.`) || key.startsWith(`${bare}[`))
  );
};

/**
 * Bindings of the shape `const t = useTranslations('cart')` or
 * `const t = getTranslations(locale, 'shared')`, mapped to their namespace.
 */
const translatorBindings = (source: string): Map<string, string> => {
  const bindings = new Map<string, string>();
  const patterns = [
    /(?:const|let)\s+(\w+)\s*=\s*useTranslations\(\s*(?:'([a-zA-Z]+)')?\s*\)/g,
    /(?:const|let)\s+(\w+)\s*=\s*getTranslations\(\s*[^,]+,\s*'([a-zA-Z]+)'\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const [, variable, namespace] = match;
      // A bare `useTranslations()` uses the root catalog; not used in this app.
      if (variable && namespace) bindings.set(variable, namespace);
    }
  }

  return bindings;
};

describe('message keys used by components', () => {
  it('every t(key) resolves in the English catalog', () => {
    const missing: string[] = [];

    for (const file of sourceFiles(SRC)) {
      const source = readFileSync(file, 'utf8');

      for (const [variable, namespace] of translatorBindings(source)) {
        const callPattern = new RegExp(`\\b${variable}\\(\\s*'([^']+)'`, 'g');

        for (const match of source.matchAll(callPattern)) {
          const key = `${namespace}.${match[1]}`;
          if (!has(key)) missing.push(`${relative(process.cwd(), file)} :: ${key}`);
        }

        const rawPattern = new RegExp(`\\b${variable}\\.raw<[^>]*>\\(\\s*'([^']+)'`, 'g');
        for (const match of source.matchAll(rawPattern)) {
          const key = `${namespace}.${match[1]}`;
          if (!has(key)) missing.push(`${relative(process.cwd(), file)} :: ${key} (raw)`);
        }

        // `t.raw('key')` without explicit type arguments (e.g. `as Perk[]` cast).
        const rawBarePattern = new RegExp(`\\b${variable}\\.raw\\(\\s*'([^']+)'`, 'g');
        for (const match of source.matchAll(rawBarePattern)) {
          const key = `${namespace}.${match[1]}`;
          if (!has(key)) missing.push(`${relative(process.cwd(), file)} :: ${key} (raw)`);
        }
      }
    }

    expect([...new Set(missing)]).toEqual([]);
  });
});
