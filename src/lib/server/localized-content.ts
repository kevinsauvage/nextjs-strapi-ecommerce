import 'server-only';

import { DEFAULT_LOCALE, type Locale } from '@/i18n/routing';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Localized catalog copy that Shopify cannot serve per locale.
 *
 * Collections and products return their default-language text from the
 * Storefront API regardless of `@inContext` unless a market exposes the
 * requested locale, and a market's locales are not manageable through the Admin
 * API. The translated strings we author live in `content/translations/<locale>.json`
 * (reviewed in git, next to the content they mirror) and are applied here, with
 * Shopify's own value as the default. When a market is later configured for
 * `es`/`fr`, Shopify wins and this layer becomes a no-op for those strings.
 */

type Translations = {
  collections?: Record<string, { title?: string; description?: string }>;
};

const MANIFEST_DIR = 'content/translations';
const cache = new Map<Locale, Translations>();

const load = (locale: Locale): Translations => {
  const cached = cache.get(locale);

  if (cached) return cached;

  let manifest: Translations = {};

  try {
    manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), `${MANIFEST_DIR}/${locale}.json`), 'utf8'),
    ) as Translations;
  } catch {
    // A missing manifest simply means "fall back to Shopify".
  }

  cache.set(locale, manifest);

  return manifest;
};

const pick = (value: string | undefined, fallback: string): string => {
  const trimmed = value?.trim();

  return trimmed || fallback;
};

export const localizedCollectionTitle = (
  handle: string,
  locale: Locale,
  fallback: string,
): string => pick(load(locale).collections?.[handle]?.title, fallback);

export const localizedCollectionDescription = (
  handle: string,
  locale: Locale,
  fallback: string,
): string => pick(load(locale).collections?.[handle]?.description, fallback);

export { DEFAULT_LOCALE };
