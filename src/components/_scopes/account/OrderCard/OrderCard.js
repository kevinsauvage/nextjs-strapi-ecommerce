import AccountRow from '../AccountRow/AccountRow';

import SuccessfulFulfillments from './SuccessfulFulfillments';

import style from './OrderCard.module.scss';

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
      </div>

      <div className={style.orderCardDetail}>
        <h6>Order informations</h6>

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
      {successfulFulfillments && successfulFulfillments.length > 0 && (
        <SuccessfulFulfillments successfulFulfillments={successfulFulfillments} />
      )}
    </li>
  );
}

export default OrderCard;
