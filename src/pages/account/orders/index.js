// import { useState } from 'react';
import Orders from '@/components/_scopes/account/Orders/Orders';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useCallback, useEffect, useState } from 'react';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import { useRouter } from 'next/router';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import Button from '@/components/Button/Button';
import Loader from '@/components/_loaders/Loader/Loader';
import { getUserOrders } from '@/lib/shopify/customer/customerApiCall';
import config from '@/config/index';
import styles from './Orders.module.scss';

export default function OrdersPage() {
  const { orders, dispatch, ordersPageInfo: pageInfo } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const { back } = useRouter();
  const { showToast } = useToastContext();

  useEffect(() => {
    if (orders) setIsLoading(false);
  }, [orders]);

  const fetchOrders = useCallback(
    async (endCursor) => {
      const shopifyToken = window.localStorage.getItem(config.localStorageKeys.shopifyToken);
      setIsLoading(true);
      const res = await getUserOrders(shopifyToken, 5, endCursor || '');
      setIsLoading(false);

      if (res?.orders) {
        dispatch({ type: actions.ADD_ORDERS, payload: res?.orders });
        dispatch({ type: actions.ADD_ORDERS_PAGEINFO, payload: res?.pageInfo });
      } else {
        showToast.error('Something went wrong, please try again later');

        back();
      }
    },
    [back, dispatch, showToast]
  );

  useEffect(() => {
    if (!orders?.length) fetchOrders();
  }, [fetchOrders, orders?.length]);

  return (
    <PageLayout title="Orders">
      <AccountLayout title="Orders">
        {!isLoading && !orders?.length ? (
          <div>
            <p>You didn&apos;t make any orders yet.</p>
          </div>
        ) : null}
        <Orders orders={orders} />
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
