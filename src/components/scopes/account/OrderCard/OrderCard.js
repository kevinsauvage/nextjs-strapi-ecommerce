import { useRouter } from 'next/router';
import config from '@/config/index';
import Card from '../Card/Card';
import style from './OrderCard.module.scss';

const ORDER_CARD = style.orderCard;
const ORDER_CARD_HEADER = style.orderCardHeader;
const ORDER_CARD_DETAIL = style.orderCardDetail;
const ORDER_CARD_BUTTON = style.orderCardButton;

/* const ORDER_CARD_LINE_ITEM = style.orderCardLineItem;
const ORDER_CARD_LINES = style.orderCardLines;
function OrderCardLineItems({ lineItems = [] }) {
  return (
    <ul className={ORDER_CARD_LINES}>
      {Array.isArray(lineItems)
        ? lineItems.map((item) => (
            <li key={item.id} className={ORDER_CARD_LINE_ITEM}>
              {item.title} x {item.quantity}
            </li>
          ))
        : null}
    </ul>
  );
} */

function OrderCard({ order }) {
  console.log('🚀 ~ file: OrderCard.js:28 ~ OrderCard ~ order', order);
  const { push } = useRouter();
  const { name, financialStatus, totalPrice, email, processedAt } = order;

  const getDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toUTCString();
  };

  const handleClickOrderDetails = () => {
    push(
      `${config.routes.orders}/${order?.id.replace('gid://shopify/Order/', '')}`
    );
  };

  return (
    <Card>
      <div className={ORDER_CARD}>
        <h4 className={ORDER_CARD_HEADER}>Order #{name}</h4>
        <div className={ORDER_CARD_DETAIL}>
          <p>Status: {financialStatus}</p>
          <p>
            Total: {totalPrice?.amount}
            {totalPrice?.currencyCode}
          </p>
          <p>Email: {email}</p>
          <p>ProcessedAt: {getDate(processedAt)}</p>
        </div>
        <button
          type="button"
          className={ORDER_CARD_BUTTON}
          onClick={handleClickOrderDetails}
        >
          See order details
        </button>
      </div>
    </Card>
  );
}

export default OrderCard;
