import type { GetCustomerOrdersQuery } from '@/shopify/storefront';

import OrderCard from '../OrderCard/OrderCard';

import styles from './Orders.module.scss';

const Orders = ({
  orders,
}: {
  orders: GetCustomerOrdersQuery['customer']['orders']['edges'] | undefined;
}) => {
  if (Array.isArray(orders)) {
    return (
      <ul className={styles.orders}>
        {orders.map((order) => (
          <OrderCard key={order.node.id} order={order.node} />
        ))}
      </ul>
    );
  }
};

export default Orders;
