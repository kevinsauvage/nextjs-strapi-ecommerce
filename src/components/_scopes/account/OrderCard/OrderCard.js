import Link from 'next/link';
import style from './OrderCard.module.scss';
import AccountRow from '../AccountRow/AccountRow';

function OrderCard({ order }) {
  const {
    financialStatus,
    email,
    processedAt,
    canceledAt,
    cancelReason,
    phone,
    fulfillmentStatus,
    totalRefundedV2,
    totalPriceV2,
    successfulFulfillments,
  } = order || {};

  const successfulFulfillment = successfulFulfillments?.[0];
  const trackingUrl = successfulFulfillment?.trackingInfo?.[0]?.url;
  const trackingNumber = successfulFulfillment?.trackingInfo?.[0]?.number;

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

  function formatStatus(status) {
    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  return (
    <li className={style.orderCard}>
      <div className={style.header}>
        <h5>Order {order.name}</h5>
        {successfulFulfillment && (
          <div className={style.trackContainer}>
            {trackingUrl ? (
              <Link className={style.trackButton} href={trackingUrl}>
                <p>Track order</p>
              </Link>
            ) : (
              <div className={style.noTrackingUrl}>
                <p>
                  Tracking Company: <span>{successfulFulfillment?.trackingCompany}</span>
                </p>
                <p>Tracking number: {trackingNumber}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={style.orderCardDetail}>
        <AccountRow title="Total price" content={`${totalPriceV2?.amount} ${totalPriceV2?.currencyCode}`} />
        {parseInt(totalRefundedV2?.amount, 10) > 0 ? (
          <AccountRow
            title="Total refounded"
            content={`${totalRefundedV2?.amount} ${totalRefundedV2?.currencyCode}`}
          />
        ) : null}
        <AccountRow title="Financial Status" content={formatStatus(financialStatus)} />
        <AccountRow title="Fulfillment Status" content={formatStatus(fulfillmentStatus)} />
        <AccountRow title="Email" content={email} />
        {phone && <AccountRow title="Phone" content={phone} />}
        <AccountRow title="ProcessedAt" content={getDate(processedAt)} />
        {canceledAt ? (
          <>
            <AccountRow title="Cancel Reason" content={cancelReason} />
            <AccountRow title="Canceled At" content={getDate(canceledAt)} />
          </>
        ) : null}
      </div>
    </li>
  );
}

export default OrderCard;
