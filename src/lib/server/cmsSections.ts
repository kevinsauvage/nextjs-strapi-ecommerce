import 'server-only';

import type { Locale } from '@/i18n/routing';
import { contentLanguage } from '@/i18n/server';
import { reportError } from '@/lib/logger';
import { selectLocalizedValue } from '@/lib/server/localized-value';
import { getStorefront } from '@/lib/server/storefront';

/**
 * Storefront CMS sections backed by Shopify metaobjects.
 *
 * Merchants edit these in Admin → Content → Metaobjects; the storefront reads
 * them through the Storefront API (definitions must expose `PUBLIC_READ`, which
 * `bin/shopify-sections.mjs` sets). Every getter degrades gracefully: a missing
 * definition, an empty metaobject, or a failed read returns `null`/`[]` so the
 * pages fall back to their built-in content instead of breaking.
 *
 * Single-instance sections are addressed by handle (`getShopMetaobjectByHandle`);
 * the FAQ is a list of `faq_item` entries (`getShopMetaObjects`), mirroring the
 * popular-searches pattern.
 */

/** Metaobject types backing the storefront CMS sections. */
export const CMS_TYPES = {
  faqItem: 'faq_item',
  faqSection: 'faq_section',
  hero: 'hero_section',
  promoBar: 'promo_bar',
  sizeChart: 'size_chart',
} as const;

/** Handles the storefront looks up for the single-instance sections. */
export const CMS_HANDLES = {
  faq: 'home-faq',
  hero: 'home-hero',
  promoBar: 'promo-bar',
  sizeChart: 'size-chart',
} as const;

/** Upper bound on FAQ entries rendered, so a large list can never bloat the page. */
export const MAX_FAQ_ITEMS = 12;

type MetaobjectField = { key: string; value?: string | null };

const toFieldMap = (fields: readonly MetaobjectField[], locale: Locale): Map<string, string> => {
  const map = new Map<string, string>();

  for (const field of fields) {
    const value = selectLocalizedValue(field.value, locale);
    if (value) map.set(field.key, value);
  }

  return map;
};

/** First non-empty value among `keys`; merchants are not locked to one schema. */
const pick = (map: Map<string, string>, ...keys: string[]): string | null => {
  for (const key of keys) {
    const value = map.get(key);
    if (value) return value;
  }

  return null;
};

const parseBoolean = (value: string | null, fallback: boolean): boolean => {
  if (value === null) return fallback;

  return ['1', 'true', 'yes', 'y', 'on'].includes(value.toLowerCase());
};

const getMetaobjectFields = async (
  handle: string,
  type: string,
  locale: Locale,
): Promise<Map<string, string> | null> => {
  try {
    const response = await (
      await getStorefront(locale)
    ).getShopMetaobjectByHandle({
      handle: { handle, type },
      language: contentLanguage(locale),
    });

    const fields = response?.metaobject?.fields;
    return fields ? toFieldMap(fields, locale) : null;
  } catch (error) {
    reportError(`cmsSections.${type}`, error);
    return null;
  }
};

export type HeroSection = {
  eyebrow: string | null;
  heading: string;
  subheading: string | null;
  image: string | null;
  imageAlt: string | null;
  primaryLabel: string | null;
  primaryUrl: string | null;
  secondaryLabel: string | null;
  secondaryUrl: string | null;
};

/**
 * Homepage hero override. Returns `null` when the merchant has not curated a
 * heading, so `HomeHero` keeps its built-in editorial hero.
 */
export const getHeroSection = async (locale: Locale): Promise<HeroSection | null> => {
  const fields = await getMetaobjectFields(CMS_HANDLES.hero, CMS_TYPES.hero, locale);
  if (!fields) return null;

  const heading = pick(fields, 'heading', 'title');
  if (!heading) return null;

  return {
    eyebrow: pick(fields, 'eyebrow', 'kicker'),
    heading,
    image: pick(fields, 'image', 'image_url'),
    imageAlt: pick(fields, 'image_alt', 'image_alt_text'),
    primaryLabel: pick(fields, 'primary_label', 'cta_label'),
    primaryUrl: pick(fields, 'primary_url', 'cta_url'),
    secondaryLabel: pick(fields, 'secondary_label'),
    secondaryUrl: pick(fields, 'secondary_url'),
    subheading: pick(fields, 'subheading', 'subheading_text', 'body'),
  };
};

export type PromoBarTone = 'ink' | 'gold' | 'neutral';

export type PromoBarSection = {
  text: string;
  linkLabel: string | null;
  linkUrl: string | null;
  tone: PromoBarTone;
  /** `false` hides the bar entirely; absent/`true` shows it. */
  active: boolean;
};

const parseTone = (value: string | null): PromoBarTone => {
  const normalized = value?.toLowerCase();

  return normalized === 'gold' || normalized === 'neutral' ? normalized : 'ink';
};

/** Announcement bar override for the header. */
export const getPromoBar = async (locale: Locale): Promise<PromoBarSection | null> => {
  const fields = await getMetaobjectFields(CMS_HANDLES.promoBar, CMS_TYPES.promoBar, locale);
  if (!fields) return null;

  const text = pick(fields, 'text', 'message');
  if (!text) return null;

  return {
    active: parseBoolean(pick(fields, 'active', 'enabled'), true),
    linkLabel: pick(fields, 'link_label', 'link_text'),
    linkUrl: pick(fields, 'link_url', 'link'),
    text,
    tone: parseTone(pick(fields, 'tone', 'style')),
  };
};

export type SizeChartSection = {
  title: string;
  /** Raw merchant HTML; sanitize before rendering. */
  body: string;
  note: string | null;
};

/** Size chart shown in the product-details accordion. */
export const getSizeChart = async (locale: Locale): Promise<SizeChartSection | null> => {
  const fields = await getMetaobjectFields(CMS_HANDLES.sizeChart, CMS_TYPES.sizeChart, locale);
  if (!fields) return null;

  const body = pick(fields, 'body', 'content', 'table');
  if (!body) return null;

  return {
    body,
    note: pick(fields, 'note', 'footnote'),
    title: pick(fields, 'title', 'heading') ?? 'Size chart',
  };
};

export type FaqItem = {
  question: string;
  /** Raw merchant HTML; sanitize before rendering. `null` when unanswered. */
  answer: string | null;
  position: number;
};

export type FaqSection = {
  title: string;
  intro: string | null;
  items: FaqItem[];
};

const getFaqItems = async (locale: Locale): Promise<FaqItem[]> => {
  try {
    const response = await (
      await getStorefront(locale)
    ).getShopMetaObjects({
      first: MAX_FAQ_ITEMS,
      language: contentLanguage(locale),
      type: CMS_TYPES.faqItem,
    });

    const parsed = (response.metaobjects?.edges ?? [])
      .map((edge) => {
        const map = toFieldMap(edge.node.fields, locale);
        const question = pick(map, 'question', 'title', 'label');
        if (!question) return null;

        const rawPosition = Number.parseInt(pick(map, 'position', 'order', 'sort') ?? '', 10);

        return {
          answer: pick(map, 'answer', 'body', 'text'),
          position: Number.isFinite(rawPosition) ? rawPosition : null,
          question,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return parsed
      .map((item, index) => ({ ...item, position: item.position ?? index }))
      .sort((a, b) => a.position - b.position)
      .slice(0, MAX_FAQ_ITEMS);
  } catch (error) {
    reportError('cmsSections.faq_item', error);
    return [];
  }
};

/**
 * Homepage FAQ accordion. Returns `null` when neither a heading nor any items
 * are curated, so the section is simply omitted.
 */
export const getFaqSection = async (locale: Locale): Promise<FaqSection | null> => {
  const [fields, items] = await Promise.all([
    getMetaobjectFields(CMS_HANDLES.faq, CMS_TYPES.faqSection, locale),
    getFaqItems(locale),
  ]);

  const title = fields ? pick(fields, 'title', 'heading') : null;

  if (!title && items.length === 0) return null;

  return {
    intro: fields ? pick(fields, 'intro', 'subheading') : null,
    items,
    title: title ?? 'Frequently asked questions',
  };
};
