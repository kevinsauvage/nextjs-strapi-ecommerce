import { useEffect, useState } from 'react';
import Orders from '@/components/scopes/account/Orders/Orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // const orders = await getOrders();
        setOrders(orders);
      } catch (e) {
        setError(e.message);
      }
    }
    fetchData();
  }, [orders]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!orders.length) {
    return <p>Loading...</p>;
  }

  return (
    <div className="orders">
      <Orders orders={orders} />
    </div>
  );
}
