'use client';

import { createContext, type ReactNode, useContext } from 'react';

import { DEFAULT_LOCALE, type Locale } from '@/i18n/routing';

/**
 * The locale of the current render, published by `src/app/[locale]/layout.tsx`.
 *
 * Internal navigation needs the locale to build a URL, and reading it from the
 * route params inside a shared component would force every page to thread it
 * through. It cannot come from `usePathname()` either: that hook opts a route out
 * of prerendering, which is the one thing the `[locale]` segment exists to
 * avoid — and the header already has to isolate it behind `<Suspense>` for the
 * same reason.
 *
 * The default is English, which is what the proxy serves an unprefixed URL as.
 * That also makes the error and 404 boundaries correct: they render outside the
 * provider and their links stay in the root language.
 */
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export const LocaleProvider = ({ locale, children }: { locale: Locale; children: ReactNode }) => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
);

export const useRenderedLocale = (): Locale => useContext(LocaleContext);
