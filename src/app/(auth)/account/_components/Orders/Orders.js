import OrderCard from '../OrderCard/OrderCard';

import styles from './Orders.module.scss';

const Orders = ({ orders }) => {
  if (Array.isArray(orders)) {
    return (
      <ul className={styles.orders}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} displayButton />
        ))}
      </ul>
    );
  }
};

export default Orders;
