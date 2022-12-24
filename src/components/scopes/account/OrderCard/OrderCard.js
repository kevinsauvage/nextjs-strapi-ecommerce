import { useRouter } from 'next/router';
import config from '@/config/index';
import style from './OrderCard.module.scss';
import AccountRow from '../AccountRow/AccountRow';

const ORDER_CARD = style.orderCard;
const ORDER_CARD_DETAIL = style.orderCardDetail;
const ORDER_CARD_BUTTON = style.orderCardButton;

function OrderCard({ order, displayButton }) {
  const { push } = useRouter();
  const {
    financialStatus,
    totalPrice,
    email,
    processedAt,
    canceledAt,
    totalRefunded,
    cancelReason,
    phone,
    fulfillmentStatus,
  } = order || {};

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
    <div className={ORDER_CARD}>
      <div className={ORDER_CARD_DETAIL}>
        <AccountRow title="Financial Status" content={financialStatus} />
        {!displayButton && (
          <AccountRow title="Fulfillment Status" content={fulfillmentStatus} />
        )}
        <AccountRow
          title="Total"
          content={`${totalPrice?.amount} ${totalPrice?.currencyCode}`}
        />
        <AccountRow title="Email" content={email} />
        {phone && <AccountRow title="Phone" content={phone} />}
        <AccountRow title="ProcessedAt" content={getDate(processedAt)} />
        {canceledAt ? (
          <>
            <AccountRow
              title="Total Refunded"
              content={`${totalRefunded.amount} ${totalRefunded.currencyCode}`}
            />
            <AccountRow title="Cancel Reason" content={cancelReason} />
            <AccountRow title="Canceled At" content={canceledAt} />
          </>
        ) : null}
      </div>
      {displayButton && (
        <button
          type="button"
          className={ORDER_CARD_BUTTON}
          onClick={handleClickOrderDetails}
        >
          See order details
        </button>
      )}
    </div>
  );
}

export default OrderCard;
