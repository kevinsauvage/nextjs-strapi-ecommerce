import EmptyState from '@/components/EmptyState/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination/PageInfoPagination';
import { adjustPaginationVariables } from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';
import { LanguageCode, OrderSortKeys } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';

import Orders from '../_components/Orders/Orders';

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
    <div>
      <h2>Orders ({response.customer?.orders?.totalCount})</h2>
      <Orders orders={edges} />
      <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
    </div>
  );
};

export default Page;
