import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import EmptyState from '@/components/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';
import seo from '@/data/seo';
import { adjustPaginationVariables } from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';
import { LanguageCode, OrderSortKeys } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';

import BackButton from '../_components/BackButton';
import Orders from '../_components/Orders';

export const dynamic = 'force-dynamic'; // Orders are user-specific

export const metadata: Metadata = {
  description: seo.account.orders.description,
  title: seo.account.orders.title,
};

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ after?: string; before?: string; sort_key?: string }>;
}) => {
  const searchParameters = await searchParams;

  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) {
    redirect(config.routes.login);
  }

  const response = await storefrontSdk().getCustomerOrders({
    customerAccessToken: shopifyToken,
    first: 5,
    ...adjustPaginationVariables({
      after: searchParameters.after || undefined,
      before: searchParameters.before || undefined,
      first: 5,
      last: undefined,
    }),
    identifiers: [],
    language: LanguageCode.En,
    sortKey: OrderSortKeys.ProcessedAt,
  });

  if (response?.customer?.orders === undefined) {
    return (
      <EmptyState
        variant="orders"
        title="Your Order List is Empty"
        subtitle="Looks like you haven't made any order yet. Start shopping to see your orders here!"
        altText="Order List is Empty"
      >
        <Link href="/" className="mt-4">
          <Button variant="default">Start Shopping</Button>
        </Link>
      </EmptyState>
    );
  }

  const { edges, pageInfo } = response.customer.orders || {};

  if (!edges?.length) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            variant="orders"
            title="No Orders Found"
            subtitle="Looks like you haven't made any orders yet. Start shopping to see your orders here!"
            altText="No Orders Found"
          >
            <Link href="/" className="mt-4">
              <Button variant="default">Start Shopping</Button>
            </Link>
          </EmptyState>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-heading-3">
            Your Orders ({response.customer?.orders?.totalCount})
          </h2>
        </CardTitle>
        <CardDescription className="text-body text-secondary">
          <p className="mb-4">Manage your addresses for a better shopping experience.</p>
          <BackButton />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Orders orders={response.customer} />
        <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
      </CardContent>
    </Card>
  );
};

export default Page;
