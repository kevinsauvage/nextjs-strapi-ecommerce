import Card from '../Card/Card';
import style from './Orders.module.scss';

function OrderCard({ item }) {
  return (
    <div className={style.orderItem}>
      <Card>
        <div>
          <p>Status: </p>
          <p>{item.fulfillmentStatus} </p>
        </div>
        <div>
          <p>Name: </p>
          <p>{item.name} </p>
        </div>
        <div>
          <p>Total price: </p>
          <p>
            {item.totalPrice?.amount} {item.totalPrice?.currencyCode}
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function Orders({ orders }) {
  return (
    <div className={style.Orders}>
      {orders && orders.length > 0 ? (
        orders
          .map((item) => ({ ...item.node }))
          .map((item) => <OrderCard key={item.id} item={item} />)
      ) : (
        <div>
          <p>You didn&apos;t make any orders yet.</p>
        </div>
      )}
    </div>
  );
}
