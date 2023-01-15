import LineItemCard from '@/components/_scopes/account/LineItemCard/LineItemCard';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import nextApiCall from '@/utils/apiNext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Address from '@/components/_scopes/account/Address/Address';
import Card from '@/components/_scopes/account/Card/Card';
import OrderCard from '@/components/_scopes/account/OrderCard/OrderCard';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import styles from './OrderPage.module.scss';

function OrderDetail() {
  const { query, back } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const { orderId } = query;
  const { showToast } = useToastContext();

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId || !query || order) return;
      try {
        const res = await nextApiCall.getOrderById(orderId);

        if (res?.error) {
          showToast.error('Something went wrong');
          back();
          return;
        }

        setOrder(res);
      } catch (error) {
        showToast.error('Something went wrong');
        back();
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [orderId, back, query, order, showToast]);

  const { name, shippingAddress, lineItems } = order || {};

  const title = `Order${name ? `: ${name}` : ''}`;

  return (
    <PageLayout title={title}>
      <AccountLayout loading={isLoading} title="Order Details">
        <div>
          <div className={styles.top}>
            <Card>
              <OrderCard order={order} />
            </Card>
            <Card title="Shipping Address">
              <Address address={shippingAddress} isAccount displayButton={false} />
            </Card>
          </div>
          <Card title="Items">
            <div className={styles.lineItems}>
              {lineItems && lineItems.map((item) => <LineItemCard key={item.variant?.id} item={item} />)}
            </div>
          </Card>
        </div>
      </AccountLayout>
    </PageLayout>
  );
}

OrderDetail.getLayout = (page) => <UserProvider>{page}</UserProvider>;

export default OrderDetail;
