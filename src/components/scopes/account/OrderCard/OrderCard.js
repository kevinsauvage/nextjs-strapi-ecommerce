import { useRouter } from 'next/router';
import config from '@/config/index';
import style from './OrderCard.module.scss';
import AccountRow from '../AccountRow/AccountRow';

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
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', options);
  };

  const handleClickOrderDetails = () => {
    push(`${config.routes.orders}/${encodeURIComponent(order?.id)}`);
  };

  return (
    <div className={style.orderCard}>
      <div className={style.orderCardDetail}>
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
          className={style.orderCardButton}
          onClick={handleClickOrderDetails}
        >
          See order details
        </button>
      )}
    </div>
  );
}

export default OrderCard;
