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

export default function OrderCard({ order }) {
  const getDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toUTCString();
  };
  return (
    <Card>
      <div className={ORDER_CARD}>
        <h4 className={ORDER_CARD_HEADER}>Order #{order.name}</h4>
        <div className={ORDER_CARD_DETAIL}>
          <p>Status: {order.financialStatus}</p>
          <p>
            Total: {order.totalPrice?.amount}
            {order.totalPrice?.currencyCode}
          </p>
          <p>Email: {order.email}</p>
          <p>ProcessedAt: {getDate(order.processedAt)}</p>
        </div>
        <button type="button" className={ORDER_CARD_BUTTON}>
          See order details
        </button>
      </div>
    </Card>
  );
}
