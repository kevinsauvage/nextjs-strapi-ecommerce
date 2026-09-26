import Breadcrumbs from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import config from '@/config';
import type { Locale } from '@/i18n/routing';
import { getTranslations, localeFromParams } from '@/i18n/server';

import AccountNavigation from './_components/AccountNavigation';
import AccountNavigationSheet from './_components/AccountNavigationSheet';

/**
 * Customer-specific (account): this page reads the visitor's Shopify session (and, for the
 * form pages, request-time query parameters), so it cannot be prerendered.
 * Blocking is the correct trade — the content is per-visitor, and the catalog
 * pages that carry the traffic stay static.
 */
export const instant = false;

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const locale: Locale = await localeFromParams(params);
  const t = getTranslations(locale, 'account');

  return (
    <div className="hero-mesh border-b border-border/60">
      <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
        <header className="mb-8 md:mb-10">
          <Breadcrumbs path={config.routes.account} />
          <div className="mt-6 flex flex-col gap-3">
            <span className="text-eyebrow-gold inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[var(--gold)]/60" />
              {t('membersEyebrow')}
            </span>
            <h1 className="text-balance">{t('accountHeading')}</h1>
            <p className="text-body-lg max-w-2xl text-secondary">{t('accountHeaderDescription')}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
          <aside className="hidden md:block">
            <div className="sticky top-32">
              <Card className="border-border/70 bg-card/90 p-2 shadow-[0_18px_44px_-24px_rgb(12_10_9/0.3)] backdrop-blur">
                <AccountNavigation />
              </Card>
            </div>
          </aside>

          <div className="w-full md:hidden">
            <AccountNavigationSheet />
          </div>

          <div className="min-w-0 md:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
