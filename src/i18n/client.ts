'use client';

import { useCallback } from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import { useRenderedLocale } from '@/components/LocaleProvider';

import { localizedPath, type RoutePath } from './routing';

/**
 * Imperative navigation that keeps the visitor in their language.
 *
 * The client-side companion to `LocalizedLink`: call sites pass a canonical
 * `RoutePath`, and this is where the locale prefix and the single `as Route`
 * assertion for imperative navigation are applied. The locale comes from
 * `LocaleProvider` (never `usePathname()`, which opts the route out of
 * prerendering).
 */
export const useLocalizedPush = (): ((path: RoutePath) => void) => {
  const router = useRouter();
  const locale = useRenderedLocale();

  return useCallback(
    (path: RoutePath) => {
      router.push(localizedPath(locale, path) as Route);
    },
    [locale, router],
  );
};
