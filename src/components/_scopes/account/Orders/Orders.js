import OrderCard from '../OrderCard/OrderCard';
import style from './Orders.module.scss';

export default function Orders({ orders }) {
  return (
    <ul className={style.Orders}>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <li key={order?.id}>
            <OrderCard order={order} displayButton />
          </li>
        ))
      ) : (
        <div>
          <p>You didn&apos;t make any orders yet.</p>
        </div>
      )}
    </ul>
  );
}
