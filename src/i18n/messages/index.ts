import { DEFAULT_LOCALE, type Locale } from '../routing';
import type { Messages } from '../types';

import { en } from './en';
import { es } from './es';
import { fr } from './fr';

const CATALOGS: Record<Locale, Messages> = { en, es, fr };

/**
 * Returns the catalog for a locale, falling back to English so a partial
 * translation can never render an empty string.
 */
export const loadMessages = (locale: Locale | string | undefined | null): Messages =>
  CATALOGS[locale as Locale] ?? CATALOGS[DEFAULT_LOCALE];

export type { Messages };
export { en, es, fr };
