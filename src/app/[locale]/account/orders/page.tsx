import type { Metadata } from 'next';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import EmptyState from '@/components/EmptyState';
import Link from '@/components/LocalizedLink';
import PageInfoPagination from '@/components/PageInfoPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import seo from '@/data/seo';
import { getTranslations, localeFromParams, redirectToPath } from '@/i18n/server';
import { getShopifyToken } from '@/lib/server/shopify-helpers';
import { adjustPaginationVariables } from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';

import BackButton from '../_components/BackButton';
import Orders from '../_components/Orders';

export const metadata: Metadata = {
  description: seo.account.orders.description,
  title: seo.account.orders.title,
};

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ after?: string; before?: string; sort_key?: string }>;
}) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'account');
  const searchParameters = await searchParams;

  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) {
    redirectToPath(config.routes.login, locale);
  }

  const response = await storefrontSdk('private').getCustomerOrders({
    customerAccessToken: shopifyToken,
    first: 5,
    ...adjustPaginationVariables({
      after: searchParameters.after || undefined,
      before: searchParameters.before || undefined,
      first: 5,
      last: undefined,
    }),
    identifiers: [],
    language: 'EN',
    sortKey: 'PROCESSED_AT',
  });

  if (response?.customer?.orders === undefined) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            variant="orders"
            title={t('noOrdersTitle')}
            subtitle={t('noOrdersSubtitle')}
            altText={t('noOrdersAlt')}
            primaryAction={
              <Button variant="default" asChild>
                <Link href={config.routes.home}>{t('startShopping')}</Link>
              </Button>
            }
            secondaryAction={
              <Link href={config.routes.collection} className="link">
                {t('browseCollections')}
              </Link>
            }
          />
        </CardContent>
      </Card>
    );
  }

  const { edges, pageInfo } = response.customer.orders || {};

  if (!edges?.length) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            variant="orders"
            title={t('noOrdersFoundTitle')}
            subtitle={t('noOrdersSubtitle')}
            altText={t('noOrdersFoundAlt')}
            primaryAction={
              <Button variant="default" asChild>
                <Link href={config.routes.home}>{t('startShopping')}</Link>
              </Button>
            }
            secondaryAction={
              <Link href={config.routes.collection} className="link">
                {t('browseCollections')}
              </Link>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeaderPattern
        as="h2"
        title={t('ordersTitle', { count: response.customer?.orders?.totalCount ?? 0 })}
        size={3}
        actions={<BackButton />}
        description={t('ordersDescription')}
      />
      <CardContent>
        <Orders orders={response.customer} />
        <PageInfoPagination
          pageInfo={pageInfo}
          searchParameters={searchParameters}
          basePath={config.routes.orders}
        />
      </CardContent>
    </Card>
  );
};

export default Page;
