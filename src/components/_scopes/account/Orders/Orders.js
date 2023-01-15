import Button from '@/components/Button/Button';
import config from '@/config/index';
import useUserContext from '@/contexts/UserContext/useUserContext';
import Table, { Body, Head, Row, TData, THead } from '../../table/Table/Table';

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
                <Button
                  contrast
                  href={`${config.routes.orders}/${encodeURIComponent(
                    order?.id
                  )}`}
                >
                  View Order
                </Button>
              </TData>
            </Row>
          ))}
      </Body>
    </Table>
  );
}
