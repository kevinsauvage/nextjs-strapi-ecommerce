import type { Metadata } from 'next';

import AccountStats from '@/app/[locale]/account/_components/AccountStats';
import CardHeaderPattern from '@/components/CardHeaderPattern';
import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import { getSeo } from '@/data/seo';
import { getTranslations, localeFromParams, redirectToPath } from '@/i18n/server';
import { getAccountStats } from '@/lib/server/account';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { getShopifyToken } from '@/lib/server/shopify-helpers';
import { getUser } from '@/utils/users';

import RecentOrdersPreview from './_components/RecentOrdersPreview';
import UserFullName from './_components/UserFullName';

import { ArrowRight, MapPin, UserRound } from 'lucide-react';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);

  return generateMetadataUtil({
    description: getSeo(locale).account.description,
    title: getSeo(locale).account.title,
    url: config.routes.account,
    noindex: true, // Private page, don't index
    locale,
  });
};

const AccountCardCTA = ({
  title,
  description,
  buttonText,
  buttonLink,
  icon,
}: {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Card className="group h-full py-0 transition-all duration-200 hover:border-foreground/20 hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        {icon && (
          <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-secondary transition-colors group-hover:bg-foreground group-hover:text-background">
            {icon}
          </span>
        )}
        <div className="flex-1 space-y-1">
          <h3 className="text-heading-4">{title}</h3>
          <p className="text-body-sm text-secondary">{description}</p>
        </div>
        <Button variant="secondary" size="sm" asChild className="w-full self-start sm:w-auto">
          <Link href={buttonLink} scroll>
            {buttonText}
            <ArrowRight size={16} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'account');
  const shopifyToken = await getShopifyToken();
  const user = await getUser();

  if (!shopifyToken || !user) {
    redirectToPath(config.routes.login, locale);
  }

  // Load the dashboard stats in one request per resource.
  const stats = await getAccountStats(shopifyToken);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeaderPattern
          as="h2"
          className="w-full"
          title={t('overview')}
          size={3}
          description={
            <>
              {t('welcomeBack')} <UserFullName user={user} />. {t('overviewHint')}
            </>
          }
        />
        <CardContent className="space-y-6">
          <AccountStats
            ordersCount={stats.ordersCount}
            addressesCount={stats.addressesCount}
            memberSince={user.createdAt}
          />

          {stats.recentOrders.length > 0 && (
            <div className="border-t pt-6">
              <RecentOrdersPreview orders={stats.recentOrders} locale={locale} />
            </div>
          )}

          <div className="grid grid-cols-1 justify-items-stretch gap-4 border-t pt-6 sm:grid-cols-2">
            <AccountCardCTA
              title={t('personalInfoTitle')}
              description={t('personalInfoDescription')}
              buttonText={t('editDetails')}
              buttonLink={config.routes.updateAccount}
              icon={<UserRound size={20} />}
            />
            <AccountCardCTA
              title={t('addressesCardTitle')}
              description={t('addressesCardDescription')}
              buttonText={t('editAddresses')}
              buttonLink={config.routes.addresses}
              icon={<MapPin size={20} />}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
