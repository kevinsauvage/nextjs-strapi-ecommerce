import type { GetCustomerOrdersQuery } from '@/shopify/storefront';

import OrderCard from './OrderCard';

const Orders = ({
  orders,
}: {
  orders: GetCustomerOrdersQuery['customer']['orders']['edges'] | undefined;
}) => {
  if (Array.isArray(orders)) {
    return (
      <ul className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <OrderCard key={order.node.id} order={order.node} />
        ))}
      </ul>
    );
  }
};

export default Orders;
