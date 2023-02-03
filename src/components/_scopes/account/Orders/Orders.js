import Link from 'next/link';
import config from '@/config/index';
import useUserContext from '@/contexts/UserContext/useUserContext';
import Table, { Body, Head, Row, TData, THead } from '../../table/Table/Table';
import styles from './Orders.module.scss';

export default function Orders({ orders }) {
  const { loading } = useUserContext();
  const getDate = (timestamp) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', options);
  };

  if (!orders?.length && !loading)
    return (
      <div>
        <p>You didn&apos;t make any orders yet.</p>
      </div>
    );

  return (
    <Table>
      <Head>
        <Row>
          <THead>Order</THead>
          <THead>Date</THead>
          <THead>Status</THead>
          <THead>Total</THead>
          <THead>Action</THead>
        </Row>
      </Head>
      <Body>
        {Array.isArray(orders) &&
          orders.map((order) => (
            <Row key={order?.id}>
              <TData>{order.name}</TData>
              <TData>{getDate(order.processedAt)}</TData>
              <TData>{order.financialStatus}</TData>
              <TData>{`${order.totalPrice?.amount} ${order.totalPrice?.currencyCode}`}</TData>
              <TData>
                <Link
                  className={styles.link}
                  href={`${config.routes.orders}/${encodeURIComponent(order?.id)}`}
                >
                  View Order
                </Link>
              </TData>
            </Row>
          ))}
      </Body>
    </Table>
  );
}
