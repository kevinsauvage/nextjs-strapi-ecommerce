import AccountRow from '../AccountRow/AccountRow';

import SuccessfulFulfillments from './SuccessfulFulfillments';

import style from './OrderCard.module.scss';

const OrderCard = ({ order }) => {
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

        <AccountRow content={`${totalPriceV2?.amount} ${totalPriceV2?.currencyCode}`} title="Total price" />
        {parseInt(totalRefundedV2?.amount, 10) > 0 ? (
          <AccountRow
            content={`${totalRefundedV2?.amount} ${totalRefundedV2?.currencyCode}`}
            title="Total refounded"
          />
        ) : null}
        <AccountRow content={formatStatus(financialStatus)} title="Financial Status" />
        <AccountRow content={formatStatus(fulfillmentStatus)} title="Fulfillment Status" />
        <AccountRow content={email} title="Email" />
        {phone && <AccountRow content={phone} title="Phone" />}
        <AccountRow content={getDate(processedAt)} title="ProcessedAt" />
        {canceledAt ? (
          <>
            <AccountRow content={cancelReason} title="Cancel Reason" />
            <AccountRow content={getDate(canceledAt)} title="Canceled At" />
          </>
        ) : null}
      </div>
      {successfulFulfillments && successfulFulfillments.length > 0 && (
        <SuccessfulFulfillments successfulFulfillments={successfulFulfillments} />
      )}
    </li>
  );
};

export default OrderCard;
