import OrderCard from '../OrderCard/OrderCard';
import styles from './Orders.module.scss';

export default function Orders({ orders }) {
  console.log('🚀 ~ file: Orders.js:6 ~ Orders ~ orders:', orders);

  if (Array.isArray(orders)) {
    return (
      <ul className={styles.orders}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} displayButton />
        ))}
      </ul>
    );
  }

  return null;
}
