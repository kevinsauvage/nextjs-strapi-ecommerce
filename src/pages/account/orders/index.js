// import { useState } from 'react';
import Orders from '@/components/scopes/account/Orders/Orders';
import Page from '@/layout/Page/Page';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useEffect, useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import { toast } from 'react-toastify';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import { useRouter } from 'next/router';

export default function OrdersPage() {
  const { orders, dispatch } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const { back } = useRouter();

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
          toast.error('Something went wrong, please try again later');

          back();
        }
      } catch (e) {
        toast.error('Something went wrong, please try again later');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, [back, dispatch]);

  return (
    <Page title="Orders">
      <AccountLayout title="Orders" loading={isLoading}>
        <div className="orders">
          <Orders orders={orders} />
        </div>
      </AccountLayout>
    </Page>
  );
}
