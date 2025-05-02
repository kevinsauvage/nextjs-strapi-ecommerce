import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import EmptyState from '@/components/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';
import { adjustPaginationVariables } from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';
import { LanguageCode, OrderSortKeys } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';

import Orders from '../_components/Orders';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ after?: string; before?: string; sort_key?: string }>;
}) => {
  const searchParameters = await searchParams;

  const shopifyToken = await getShopifyToken();

  const response = await storefrontSdk().getCustomerOrders({
    customerAccessToken: shopifyToken,
    first: 5,
    ...adjustPaginationVariables({
      after: searchParameters.after,
      before: searchParameters.before,
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
        title="Your Order List is Empty"
        subtitle="Looks like you haven’t made any order yet"
        altText="Order List is Empty"
      />
    );
  }

  const { edges, pageInfo } = response.customer.orders || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders ({response.customer?.orders?.totalCount})</CardTitle>
        <CardDescription>
          <p className="mb-4">Manage your addresses for a better shopping experience.</p>
          <Button variant="secondary">
            <ArrowLeft size={16} />
            <Link href={config.routes.account}>Back to account</Link>
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Orders orders={edges} />
        <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
      </CardContent>
    </Card>
  );
};

export default Page;
