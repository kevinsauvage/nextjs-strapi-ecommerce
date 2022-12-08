import style from './Orders.module.scss';

export default function Orders({ orders }) {
  return (
    <div className={style.Orders}>
      <div>
        {orders && orders.length > 0 ? (
          orders.map((item) => JSON.stringify(item))
        ) : (
          <div>
            <p>You didn&apos;t make any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
