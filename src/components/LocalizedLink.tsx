'use client';

import type { ComponentProps } from 'react';
import type { Route } from 'next';
import Link from 'next/link';

import { useRenderedLocale } from '@/components/LocaleProvider';
import { localizedPath } from '@/i18n/routing';

import type { UrlObject } from 'url';

/**
 * Internal link that keeps the visitor in their language.
 *
 * Every route lives under the `[locale]` segment, so a bare `config.routes` href
 * would drop a Spanish visitor back into English on the next click. This
 * component re-applies the locale of the current render, which means call sites
 * keep passing unprefixed canonical paths (`config.routes.*`) and never have to
 * thread a locale through.
 *
 * The locale comes from `LocaleProvider` rather than `usePathname()`: that hook
 * prevents a route from being prerendered, and this component is used by nearly
 * every link in the app.
 *
 * `href` is deliberately `string` rather than Next's `Route`: the generated route
 * types only accept a locale-prefixed path (`` `/${string}/collections` ``), while
 * call sites hold unprefixed canonical paths. This is the single place the prefix
 * is applied, and the single `as Route` assertion in the app.
 */
type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string | UrlObject;
};

const LocalizedLink = ({ href, ...rest }: LocalizedLinkProps) => {
  const locale = useRenderedLocale();

  // `UrlObject` hrefs (and anything non-string) are left untouched.
  const target = typeof href === 'string' ? localizedPath(locale, href) : href;

  return <Link {...rest} href={target as Route} />;
};

export default LocalizedLink;
