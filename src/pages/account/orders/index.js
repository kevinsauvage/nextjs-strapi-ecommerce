// import { useState } from 'react';
import Orders from '@/components/_scopes/account/Orders/Orders';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useEffect, useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import { useRouter } from 'next/router';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

export default function OrdersPage() {
  const { orders, dispatch } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const { back } = useRouter();
  const { showToast } = useToastContext();

  useEffect(() => {
    if (orders) setIsLoading(false);
  }, [orders]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await nextApiCall.getCustomerOrders();

        console.log('🚀 ~ file: index.js:28 ~ fetchOrders ~ res', res);

        if (res) {
          dispatch({ type: actions.ADD_ORDERS, payload: res });
        } else {
          showToast.error('Something went wrong, please try again later');

          back();
        }
      } catch (e) {
        showToast.error('Something went wrong, please try again later');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [back, dispatch, showToast]);

  return (
    <PageLayout title="Orders">
      <AccountLayout title="Orders" loading={isLoading}>
        <Orders orders={orders} />
      </AccountLayout>
    </PageLayout>
  );
}

OrdersPage.getLayout = (page) => <UserProvider>{page}</UserProvider>;
