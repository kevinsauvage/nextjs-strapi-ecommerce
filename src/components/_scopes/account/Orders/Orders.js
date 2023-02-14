import OrderCard from '../OrderCard/OrderCard';
import styles from './Orders.module.scss';

export default function Orders({ orders }) {
  if (Array.isArray(orders)) {
    return (
      <div className={styles.orders}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} displayButton />
        ))}
      </div>
    );
  }

  return null;
}
