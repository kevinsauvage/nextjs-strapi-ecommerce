import 'server-only';

import type { Locale } from '@/i18n/routing';
import { contentLanguage } from '@/i18n/server';
import { reportError } from '@/lib/logger';
import { selectLocalizedValue } from '@/lib/server/localized-value';
import { getStorefront } from '@/lib/server/storefront';

/**
 * Metaobject type a merchant creates to curate the "Popular searches" chips on
 * `/search`. Entry fields may use any of the keys below (first non-empty wins),
 * so merchandisers are not locked to one schema. See README.
 */
export const POPULAR_SEARCH_METAOBJECT_TYPE = 'popular_search_term';

const TERM_FIELD_KEYS = ['term', 'query', 'label', 'title'] as const;

const MAX_POPULAR_SEARCHES = 8;

/** Fallback chips shown when the merchant has not curated any terms. */
export const DEFAULT_POPULAR_SEARCHES: readonly string[] = [
  'Dog beds',
  'Cat trees',
  'Dog carriers',
  'Harnesses',
  'Cushions',
];

const pickTerm = (
  fields: Array<{ key: string; value?: string | null }>,
  locale: Locale,
): string | null => {
  for (const key of TERM_FIELD_KEYS) {
    const raw = fields.find((field) => field.key === key)?.value;
    const value = selectLocalizedValue(raw, locale);

    if (value) return value;
  }

  return null;
};

/**
 * Curated popular search terms from a `popular_search_term` metaobject, falling
 * back to a static list when the type is missing/empty or the read fails.
 */
export const getPopularSearchTerms = async (locale: Locale): Promise<string[]> => {
  try {
    const response = await (
      await getStorefront(locale)
    ).getShopMetaObjects({
      first: MAX_POPULAR_SEARCHES,
      language: contentLanguage(locale),
      type: POPULAR_SEARCH_METAOBJECT_TYPE,
    });

    const terms = (response.metaobjects?.edges ?? [])
      .map((edge) => pickTerm(edge.node.fields, locale))
      .filter((term): term is string => Boolean(term));

    return terms.length > 0
      ? Array.from(new Set(terms)).slice(0, MAX_POPULAR_SEARCHES)
      : [...DEFAULT_POPULAR_SEARCHES];
  } catch (error) {
    reportError('getPopularSearchTerms', error);
    return [...DEFAULT_POPULAR_SEARCHES];
  }
};
