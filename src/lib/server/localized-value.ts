import 'server-only';

import { DEFAULT_LOCALE, type Locale } from '@/i18n/routing';

/**
 * Picks the value for `locale` out of a field that stores several languages.
 *
 * The Storefront API returns a metaobject field verbatim — it does not resolve
 * `@inContext` for them — so localized fields are written as a JSON map keyed by
 * locale (`{ en, es, fr }`, see `bin/shopify-translations.mjs`). Plain,
 * unlocalized values are returned untouched, so a merchant can mix both.
 */
export const selectLocalizedValue = (value: string | null | undefined, locale: Locale): string => {
  const raw = value?.trim();

  if (!raw) return '';

  if (!raw.startsWith('{')) return raw;

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return raw;
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return raw;

  const map = parsed as Record<string, unknown>;
  const entry = map[locale] ?? map[DEFAULT_LOCALE];

  return typeof entry === 'string' ? entry : raw;
};
