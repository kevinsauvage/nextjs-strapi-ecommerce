import Card from '../Card/Card';
import OrderCard from '../OrderCard/OrderCard';
import style from './Orders.module.scss';

export default function Orders({ orders }) {
  return (
    <div className={style.Orders}>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order?.id} title={order.name}>
            <OrderCard order={order} displayButton />
          </Card>
        ))
      ) : (
        <div>
          <p>You didn&apos;t make any orders yet.</p>
        </div>
      )}
    </div>
  );
}
