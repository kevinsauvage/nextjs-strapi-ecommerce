'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Link from '@/components/LocalizedLink';
import { accountNav } from '@/config';
import { splitLocalePrefix } from '@/i18n/routing';
import type { Messages } from '@/i18n/types';
import { cn } from '@/utils/cn';

import { BookText, BookUser, Heart, LogOut, type LucideIcon, Package, User } from 'lucide-react';

const linkIcons: Record<string, LucideIcon> = {
  'Account overview': User,
  'Address book': BookUser,
  'My details': BookText,
  'My orders': Package,
  'My wishlist': Heart,
  'Sign out': LogOut,
};

/** Maps the canonical `accountNav` titles onto `account` message keys. */
const TITLE_KEYS: Record<string, keyof Messages['account']> = {
  'Account overview': 'overview',
  'Address book': 'addressBook',
  'My details': 'details',
  'My orders': 'orders',
  'My wishlist': 'wishlist',
  'Sign out': 'logout',
};

type NavLink = (typeof accountNav)[number];

const AccountNavigation = ({ handleClose }: { handleClose?: () => void }) => {
  const t = useTranslations('account');
  // `usePathname()` includes the locale segment (`/es/account`); strip it so the
  // active check compares against the canonical `accountNav` paths.
  const currentPathname = splitLocalePrefix(usePathname()).pathname;

  const mainLinks = accountNav.filter((link) => link.title !== 'Sign out');
  const signOutLink = accountNav.find((link) => link.title === 'Sign out');

  const renderLink = (link: NavLink, isSignOut = false) => {
    const Icon = linkIcons[link.title];
    const isActive = !isSignOut && currentPathname === link.url;
    const key = TITLE_KEYS[link.title];
    const label = key ? t(key) : link.title;

    return (
      <Link
        key={link.url}
        href={link.url}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => {
          handleClose?.();
        }}
        className={cn(
          'group flex min-h-11 items-center gap-3 rounded-lg px-3 text-body-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isSignOut
            ? 'text-secondary hover:bg-destructive/10 hover:text-destructive'
            : isActive
              ? 'bg-foreground text-background'
              : 'text-foreground hover:bg-muted',
        )}
      >
        {Icon ? (
          <Icon
            size={18}
            className={cn(
              'shrink-0 transition-colors',
              isSignOut
                ? 'text-secondary group-hover:text-destructive'
                : isActive
                  ? 'text-background'
                  : 'text-secondary group-hover:text-foreground',
            )}
          />
        ) : null}
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <nav aria-label={t('navAria')} className="flex flex-col gap-1 p-1">
      <p className="text-eyebrow px-3 pb-2">{t('navMenu')}</p>
      {mainLinks.map((link) => renderLink(link))}
      {signOutLink && (
        <div className="mt-2 border-t border-border pt-2">{renderLink(signOutLink, true)}</div>
      )}
    </nav>
  );
};

export default AccountNavigation;
