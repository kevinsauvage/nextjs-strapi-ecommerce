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
    const fetchAddresses = async () => {
      try {
        const res = await nextApiCall.getCustomerOrders();
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
    fetchAddresses();
  }, [back, dispatch, showToast]);

  return (
    <PageLayout title="Orders">
      <AccountLayout title="Orders" loading={isLoading}>
        <div className="orders">
          <Orders orders={orders} />
        </div>
      </AccountLayout>
    </PageLayout>
  );
}

OrdersPage.getLayout = (page) => <UserProvider>{page}</UserProvider>;
