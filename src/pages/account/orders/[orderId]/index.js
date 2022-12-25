import LineItemCard from '@/components/scopes/account/LineItemCard/LineItemCard';
import Page from '@/layout/Page/Page';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import nextApiCall from '@/utils/apiNext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import config from '@/config/index';
import Address from '@/components/scopes/account/Address/Address';
import Card from '@/components/scopes/account/Card/Card';
import OrderCard from '@/components/scopes/account/OrderCard/OrderCard';
import styles from './OrderPage.module.scss';

function OrderDetail() {
  const { query, back } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const { orderId } = query;
  const id = `${orderId}?key=${query.key}`;

  useEffect(() => {
    async function fetchOrder() {
      try {
        if (!orderId || !query) return;

        const res = await nextApiCall.getOrderById(id);

        if (res?.error) {
          toast.error('Something went wrong');
          back();
          return;
        }

        setOrder(res);
      } catch (error) {
        toast.error('Something went wrong');
        back();
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [id, orderId, back, query]);

  const { name, shippingAddress, lineItems } = order || {};

  const title = `Order${name ? `: ${name}` : ''}`;

  return (
    <Page title={title}>
      <AccountLayout
        loading={isLoading}
        title={title}
        backTo={{ name: 'Back to orders', href: config.routes.orders }}
        subtitle='"View detailed information about a specific order, including items, delivery address, and status, on the order details page. Track the progress of your order and update your delivery address if necessary. Thank you for your business and we hope you have a great experience with us."'
      >
        <div>
          <div className={styles.top}>
            <Card title="Order details">
              <OrderCard order={order} />
            </Card>
            <Card title="Shipping Address">
              <Address
                address={shippingAddress}
                isAccount
                displayButton={false}
              />
            </Card>
          </div>

          <Card title="Items">
            <div className={styles.lineItems}>
              {lineItems &&
                lineItems.map((item) => (
                  <LineItemCard key={item.variant?.id} item={item} />
                ))}
            </div>
          </Card>
        </div>
      </AccountLayout>
    </Page>
  );
}

export default OrderDetail;
