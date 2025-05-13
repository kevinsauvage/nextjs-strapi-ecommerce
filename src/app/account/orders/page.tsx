import Link from 'next/link';

import EmptyState from '@/components/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adjustPaginationVariables } from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';
import { LanguageCode, OrderSortKeys } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';

import BackButton from '../_components/BackButton';
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

  if (!edges?.length) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            title="No Orders Found"
            subtitle="Looks like you haven’t made any orders yet"
            altText="No Orders Found"
          >
            <Button variant="default" className="mt-4">
              <Link href="/">Start Shopping</Link>
            </Button>
          </EmptyState>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-medium">
            Your Orders ({response.customer?.orders?.totalCount})
          </h2>
        </CardTitle>
        <CardDescription>
          <p className="mb-4">Manage your addresses for a better shopping experience.</p>
          <BackButton />
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
