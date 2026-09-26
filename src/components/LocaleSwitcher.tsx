'use client';

import { useTranslations } from 'next-intl';

import { useRenderedLocale } from '@/components/LocaleProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { writeLocaleCookie } from '@/i18n/browser';
import { LOCALE_LABELS, LOCALES, localizedPath, splitLocalePrefix } from '@/i18n/routing';
import { cn } from '@/utils/cn';

import { Check, Globe } from 'lucide-react';

/**
 * Language switcher.
 *
 * The locale is a path segment, so switching language is a real navigation to
 * the same page in the other language (`/collections` → `/es/collections`). The
 * visitor stays on the page they were reading, and the destination is a normal
 * indexable URL rather than a query parameter or a cookie.
 *
 * The target is resolved from `window.location` on click rather than from
 * `usePathname()`: that hook prevents a route from being prerendered, and the
 * alternatives for the other locales would need the same page rendered once per
 * language. The cookie only records the explicit choice, so a later visit to an
 * unprefixed URL starts in that language (`src/proxy.ts` reads it).
 * `aria-current` marks the active language.
 */
const LocaleSwitcher = ({ className }: { className?: string }) => {
  const t = useTranslations('language');
  const locale = useRenderedLocale();

  const select = (next: (typeof LOCALES)[number]) => {
    if (next === locale) return;

    // Strip the active locale first, so the visitor stays on the same page.
    const { pathname } = splitLocalePrefix(window.location.pathname);

    writeLocaleCookie(next);
    window.location.assign(localizedPath(next, `${pathname}${window.location.search}`));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('change')}
          className={cn('min-h-11 min-w-11', className)}
        >
          <Globe size={20} strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LOCALES.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => select(option)}
            aria-current={option === locale ? 'true' : undefined}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-3',
              option === locale && 'font-medium',
            )}
          >
            {LOCALE_LABELS[option]}
            {option === locale ? (
              <Check size={14} className="text-[var(--gold)]" aria-hidden="true" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
