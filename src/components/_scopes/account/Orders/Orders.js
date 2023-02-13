import useUserContext from '@/contexts/UserContext/useUserContext';
import OrderCard from '../OrderCard/OrderCard';

export default function Orders({ orders }) {
  const { loading } = useUserContext();

  if (!orders?.length && !loading)
    return (
      <div>
        <p>You didn&apos;t make any orders yet.</p>
      </div>
    );

  return Array.isArray(orders) && orders.map((order) => <OrderCard key={order.id} order={order} />);
}
