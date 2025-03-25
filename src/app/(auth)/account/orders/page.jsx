import NotFoundIllustration from '@/assets/NotFoundIllustration.svg';
import EmptyState from '@/components/EmptyState/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination/PageInfoPagination';
import getClient from '@/shopify/index';
import { getShopifyToken } from '@/utils/shopify';

import Orders from '../_components/Orders/Orders';

const Page = async ({ searchParams }) => {
  const searchParameters = await searchParams;

  const shopifyToken = await getShopifyToken();

  const response = await getClient().storefront.customer.queryCustomerOrders({
    after: searchParameters.after,
    before: searchParameters.before,
    customerAccessToken: shopifyToken,
    first: 5,
    sortKey: searchParameters.sort_key,
  });
  console.log('🟩🟪🟦-->  ~ response ~ response:', response);

  const { orders, pageInfo } = response || {};

  if (!orders?.length) {
    return (
      <EmptyState
        image={NotFoundIllustration}
        title="Your Order List is Empty"
        subtitle="Looks like you haven’t made any order yet"
        altText="Order List is Empty"
      />
    );
  }

  return (
    <div>
      <h2>Orders</h2>
      <Orders orders={orders} />
      <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
    </div>
  );
};

export default Page;
