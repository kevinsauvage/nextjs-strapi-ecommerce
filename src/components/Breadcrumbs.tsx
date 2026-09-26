import Link from '@/components/LocalizedLink';
import config from '@/config';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';

import { ChevronRight } from 'lucide-react';

/**
 * `decodeURIComponent` throws a `URIError` on malformed input (e.g. a bare `%`).
 * Breadcrumb labels come straight from the URL, so fall back to the raw segment
 * instead of crashing the render.
 */
const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const Crumbs = ({ title, href, last }: { title: string; href: string; last: boolean }) => {
  if (last) {
    const t = safeDecode(title)
      .replace('gid://shopify/Order/', '')
      .replace('gid://shopify/MailingAddress/', '')
      .split('?')[0];
    return (
      <strong
        aria-current="page"
        className="text-body-sm text-secondary text-ellipsis whitespace-nowrap font-semibold"
      >
        {t}
      </strong>
    );
  }

  return (
    <>
      <Link
        href={href}
        className="text-body-sm text-secondary hover:text-primary transition-colors text-ellipsis whitespace-nowrap font-medium"
      >
        {safeDecode(title)}
      </Link>
      {!last && <ChevronRight size={16} className="text-secondary shrink-0" />}
    </>
  );
};

/** Segments that are structure, not a step the visitor can click back to. */
const FILTERED = new Set(['pages', 'reset', 'collections', 'products']);

/**
 * Trail of links derived from the current page's canonical path.
 *
 * `path` is passed in rather than read with `usePathname()`: that hook prevents a
 * route from being prerendered, and every caller already knows its own path.
 * The locale segment is not a step in the journey — `/es/collections/dogs` is
 * Home › collections › dogs — and `LocalizedLink` re-applies the locale to each
 * generated href.
 */
const Breadcrumbs = ({ lastElement, path }: { lastElement?: string; path: string }) => {
  const shared = getTranslations(DEFAULT_LOCALE, 'shared');
  const segments = path.split('/').filter(Boolean);

  const crumbs = segments
    .map((segment, index) => ({
      href: `/${segments.slice(0, index + 1).join('/')}`,
      isFiltered: FILTERED.has(segment.split('-').join(' ').toLowerCase()),
      title: segment.split('-').join(' ').replaceAll('_', ' '),
    }))
    .filter((crumb) => !crumb.isFiltered);

  const breadcrumbs = [{ href: config.routes.home, title: shared('home') }, ...crumbs];

  if (breadcrumbs.length <= 1) return null;

  return (
    <div>
      <nav aria-label={shared('breadcrumb')} className="md:block container mx-auto">
        <ol className="flex items-center space-x-1">
          {breadcrumbs.map((crumb, index) => (
            <li
              key={crumb.href}
              className="flex items-center space-x-1 overflow-ellipsis overflow-hidden"
            >
              {lastElement && index === breadcrumbs.length - 1 ? (
                <p
                  aria-current="page"
                  className="text-body-sm text-secondary font-medium text-ellipsis whitespace-nowrap overflow-hidden"
                >
                  {lastElement}
                </p>
              ) : (
                <Crumbs {...crumb} last={index === breadcrumbs.length - 1} />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};
export default Breadcrumbs;
