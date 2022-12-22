import { useRouter } from 'next/router';
import config from '@/config/index';
import OrderCard from '../OrderCard/OrderCard';
import style from './Orders.module.scss';

export default function Orders({ orders, displaySeeAllButton }) {
  const { push } = useRouter();

  const handleSeeAll = () => {
    push(config.routes.orders);
  };
  return (
    <div className={style.Orders}>
      {orders && orders.length > 0 ? (
        orders.map((order) => <OrderCard key={order?.id} order={order} />)
      ) : (
        <div>
          <p>You didn&apos;t make any orders yet.</p>
        </div>
      )}
      {displaySeeAllButton && (
        <button type="button" onClick={handleSeeAll}>
          See All
        </button>
      )}
    </div>
  );
}
