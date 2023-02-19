// import { useState } from 'react';
import Orders from '@/components/_scopes/account/Orders/Orders';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useCallback, useEffect, useState } from 'react';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import Button from '@/components/Button/Button';
import Loader from '@/components/_loaders/Loader/Loader';
import config from '@/config/index';
import { handleGetTokenCookies } from '@/helpers/cookies';
import getClient from '@/shopify/index';
import styles from './Orders.module.scss';

export default function OrdersPage() {
  const { orders, dispatch, ordersPageInfo: pageInfo } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToastContext();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (orders) setIsLoading(false);
  }, [orders]);

  const fetchOrders = useCallback(
    async (endCursor) => {
      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);
      setIsLoading(true);
      const res = await getClient().customer.queryCustomerOrders({
        customerAccessToken: shopifyToken,
        first: 5,
        after: endCursor,
      });

      setIsLoading(false);

      if (res?.orders) {
        const totalOrders = res.totalCount;

        // TODO
        console.log('🚀 ~ file: index.js:44 ~ totalOrders', totalOrders);

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

  return (
    <PageLayout title="Orders" description={description}>
      <AccountLayout title="Orders" titleBannerChildren="My orders" descriptionBannerChildren={description}>
        {!isLoading && !orders?.length ? (
          <div>
            <p>You didn&apos;t make any orders yet.</p>
          </div>
        ) : null}
        {error ? <p>Error</p> : <Orders orders={orders} />}
        {isLoading ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : (
          <Button disabled={!pageInfo?.hasNextPage} primary onClick={() => fetchOrders(pageInfo.endCursor)}>
            See more
          </Button>
        )}
      </AccountLayout>
    </PageLayout>
  );
}

OrdersPage.getLayout = (page) => <UserProvider>{page}</UserProvider>;
