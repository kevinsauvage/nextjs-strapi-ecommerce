import { getRequestConfig } from 'next-intl/server';

import { loadMessages } from './messages';
import { DEFAULT_LOCALE, isLocale } from './routing';

/**
 * `next-intl` request configuration.
 *
 * Deliberately free of request reads (`headers()`): under Cache Components a
 * request read opts a page out of prerendering, and the locale is already part
 * of the route. The server tree therefore never uses `next-intl`'s server-side
 * helpers — it passes the locale explicitly (`getTranslations(locale, …)`,
 * `getStorefront(locale)`) — and this config only backs the plugin wiring in
 * `next.config.ts` plus any client fallback.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  return {
    locale: isLocale(requested) ? requested : DEFAULT_LOCALE,
    messages: loadMessages(requested),
  };
});
