/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useState } from 'react';

import NotFoundIllustration from '@/assets/NotFoundIllustration.svg';
import Orders from '@/components/_scopes/account/Orders/Orders';
import Button from '@/components/Button/Button';
import EmptyState from '@/components/EmptyState/EmptyState';
import config from '@/config/index';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import useUserContext from '@/contexts/UserContext/useUserContext';
import seo from '@/data/seo';
import { handleGetTokenCookies } from '@/helpers/cookies';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

export default function OrdersPage() {
  const { orders, dispatch, ordersPageInfo: pageInfo } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastContext();
  const [error, setError] = useState(false);

  const fetchOrders = useCallback(
    async (endCursor) => {
      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);
      setIsLoading(true);
      const res = await getClient().storefront.customer.queryCustomerOrders({
        customerAccessToken: shopifyToken,
        first: 5,
        after: endCursor,
      });

      setIsLoading(false);

      if (res?.orders) {
        dispatch({ type: actions.ADD_ORDERS, payload: res?.orders });
        dispatch({ type: actions.ADD_ORDERS_PAGEINFO, payload: res?.pageInfo });
      } else {
        showToast.error('Something went wrong, please try again later');
        setError(true);
      }
    },
    [dispatch, showToast]
  );

  useEffect(() => {
    if (!orders?.length) fetchOrders();
  }, [fetchOrders, orders?.length]);

  const description =
    'This page shows all of your previous orders in one place. You can see the order number, date, items purchased, and order status. This makes it easy to keep track of your orders and track their progress. You can use this page to view and manage your orders whenever you need to.';

  const renderContent = () => {
    if (error) return <p>Error</p>;
    if (orders.length || isLoading) {
      return (
        <>
          <Orders orders={orders} />
          {pageInfo?.hasNextPage && (
            <Button disabled={!pageInfo?.hasNextPage} primary onClick={() => fetchOrders(pageInfo.endCursor)}>
              See more
            </Button>
          )}
        </>
      );
    }
    return (
      <EmptyState
        image={NotFoundIllustration}
        title="Your Order List is Empty"
        subtitle="Looks like you haven’t made any order yet"
      />
    );
  };
  return (
    <PageLayout title={seo.account.orders.title} description={seo.account.orders.description}>
      <AccountLayout
        loading={isLoading}
        title={seo.account.orders.title}
        descriptionBannerChildren={orders?.length > 0 && description}
      >
        {renderContent()}
      </AccountLayout>
    </PageLayout>
  );
}
