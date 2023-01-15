import config from '@/config/index';
import Link from 'next/link';
import style from './OrderCard.module.scss';
import AccountRow from '../AccountRow/AccountRow';

function OrderCard({ order, displayButton }) {
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
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className={style.orderCard}>
      <div className={style.header}>
        <h5>Order {order.name}</h5>
        {displayButton && (
          <Link
            href={`${config.routes.orders}/${encodeURIComponent(order?.id)}`}
            type="button"
            className={style.link}
          >
            See order details
          </Link>
        )}
      </div>
      <div className={style.orderCardDetail}>
        <AccountRow title="Financial Status" content={financialStatus} />
        {!displayButton && <AccountRow title="Fulfillment Status" content={fulfillmentStatus} />}
        <AccountRow title="Total" content={`${totalPrice?.amount} ${totalPrice?.currencyCode}`} />
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
    </div>
  );
}

export default OrderCard;
