import type { Metadata } from 'next';

import AccountStats from '@/app/[locale]/account/_components/AccountStats';
import CardHeaderPattern from '@/components/CardHeaderPattern';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import { getSeo } from '@/data/seo';
import { getTranslations, localeFromParams, redirectToPath } from '@/i18n/server';
import { getAccountStats } from '@/lib/server/account';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { getShopifyToken } from '@/lib/server/shopify-helpers';
import { getUser } from '@/utils/users';

import BackButton from '../_components/BackButton';

import UpdateUserForm from './_components/UpdateUserForm';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);

  return generateMetadataUtil({
    description: getSeo(locale).account.update.description,
    title: getSeo(locale).account.update.title,
    url: config.routes.updateAccount,
    noindex: true, // Private page, don't index
    locale,
  });
};

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'account');
  const shopifyToken = await getShopifyToken();
  const user = await getUser();

  if (!user) {
    redirectToPath(config.routes.login, locale);
  }

  const stats = shopifyToken
    ? await getAccountStats(shopifyToken)
    : { addressesCount: 0, ordersCount: 0, recentOrders: [] };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeaderPattern
          as="h2"
          title={t('updateTitle')}
          size={3}
          actions={<BackButton />}
          description={t('updateDescription')}
        />
        <CardContent className="space-y-6">
          <UpdateUserForm user={user} />
        </CardContent>
      </Card>

      {user && (
        <Card>
          <CardHeaderPattern
            as="h2"
            title={t('statsTitle')}
            size={4}
            description={t('statsDescription')}
          />
          <CardContent>
            <AccountStats
              ordersCount={stats.ordersCount}
              addressesCount={stats.addressesCount}
              memberSince={user.createdAt}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
