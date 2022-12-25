// import { useState } from 'react';
import Orders from '@/components/scopes/account/Orders/Orders';
import Page from '@/layout/Page/Page';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useEffect, useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import { toast } from 'react-toastify';

export default function OrdersPage() {
  const [orders, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await nextApiCall.getCustomerOrders();
        if (res && res?.length > 0) setAddresses(res);
        else throw new Error();
      } catch (e) {
        toast.error('Something went wrong, please try again later');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  return (
    <Page title="Orders">
      <AccountLayout
        loading={isLoading}
        title="Orders"
        subtitle="Welcome to your order history! Here you can find a complete list of all your orders with us, along with details such as the date of purchase, the items included, and the delivery status. This is a useful resource for keeping track of your purchases and ensuring that your orders are being processed and delivered efficiently."
      >
        <div className="orders">
          <Orders orders={orders} />
        </div>
      </AccountLayout>
    </Page>
  );
}
