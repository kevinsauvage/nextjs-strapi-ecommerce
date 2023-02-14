// import { useState } from 'react';
import Orders from '@/components/_scopes/account/Orders/Orders';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useCallback, useEffect, useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import { useRouter } from 'next/router';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import Button from '@/components/Button/Button';
import Loader from '@/components/_loaders/Loader/Loader';
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
      try {
        setIsLoading(true);
        const res = await nextApiCall.getCustomerOrders(5, endCursor || '');

        if (res?.orders) {
          dispatch({ type: actions.ADD_ORDERS, payload: res?.orders });
          dispatch({ type: actions.ADD_ORDERS_PAGEINFO, payload: res?.pageInfo });
        } else {
          showToast.error('Something went wrong, please try again later');

          back();
        }
      } catch (e) {
        showToast.error('Something went wrong, please try again later');
      } finally {
        setIsLoading(false);
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
