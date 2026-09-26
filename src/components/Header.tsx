import { Suspense } from 'react';

import Logo from '@/components/Logo';
import PromoBar from '@/components/PromoBar';
import UserButtons from '@/components/UserButtons';
import type { Locale } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';
import { getPromoBar } from '@/lib/server/cmsSections';
import type { GetMenuByHandleQuery } from '@/shopify/storefront';

import DesktopNav, { DesktopNavView } from './DesktopNav';
import HamburgerMenu, { HamburgerMenuView } from './HamburgerMenu';

import { Truck } from 'lucide-react';

const Header = async ({
  headerMenu,
  locale,
}: {
  headerMenu: GetMenuByHandleQuery['menu'] | null | undefined;
  locale: Locale;
}) => {
  const navItems = headerMenu?.items ?? [];
  const promo = await getPromoBar(locale);
  const t = getTranslations(locale, 'footer');

  return (
    <>
      {promo ? (
        // `active: false` hides the bar entirely; a curated bar replaces the
        // built-in shipping message.
        promo.active ? (
          <PromoBar promo={promo} />
        ) : null
      ) : (
        <div className="bg-primary text-primary-foreground">
          <p className="container mx-auto flex items-center justify-center gap-2 px-4 py-2 text-center text-[12px] font-medium tracking-[0.08em] uppercase">
            <Truck size={14} strokeWidth={1.75} aria-hidden="true" />
            {t('freeShipping')} · {t('thirtyDayReturns')}
          </p>
        </div>
      )}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 w-full items-center gap-3 md:h-[72px]">
            <div className="flex flex-1 items-center gap-2">
              <Suspense fallback={<HamburgerMenuView headerMenu={headerMenu} />}>
                <HamburgerMenu headerMenu={headerMenu} />
              </Suspense>
              <Logo />
            </div>
            <Suspense fallback={<DesktopNavView items={navItems} />}>
              <DesktopNav items={navItems} />
            </Suspense>
            <div className="flex flex-1 justify-end">
              <UserButtons />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
