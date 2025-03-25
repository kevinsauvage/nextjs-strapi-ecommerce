import AccountRow from '../AccountRow/AccountRow';

import SuccessfulFulfillments from './SuccessfulFulfillments';

import style from './OrderCard.module.scss';

function formatStatus(status) {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

const getDate = (timestamp) => {
  const options = {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  };

  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', options);
};

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

  return (
    <li className={style.card}>
      <div className={style.header}>
        <h5>Order {order.name}</h5>
      </div>

      <div className={style.detail}>
        <h6>Order informations</h6>

        <AccountRow content={`${totalPriceV2?.amount} ${totalPriceV2?.currencyCode}`} title="Total price" />
        {Number.parseInt(totalRefundedV2?.amount, 10) > 0 && (
          <AccountRow
            content={`${totalRefundedV2?.amount} ${totalRefundedV2?.currencyCode}`}
            title="Total refounded"
          />
        )}
        <AccountRow content={formatStatus(financialStatus)} title="Financial Status" />
        <AccountRow content={formatStatus(fulfillmentStatus)} title="Fulfillment Status" />
        <AccountRow content={email} title="Email" />
        {phone && <AccountRow content={phone} title="Phone" />}
        <AccountRow content={getDate(processedAt)} title="ProcessedAt" />
        {canceledAt && (
          <>
            <AccountRow content={cancelReason} title="Cancel Reason" />
            <AccountRow content={getDate(canceledAt)} title="Canceled At" />
          </>
        )}
      </div>
      {successfulFulfillments && successfulFulfillments.length > 0 && (
        <SuccessfulFulfillments successfulFulfillments={successfulFulfillments} />
      )}
    </li>
  );
};

export default OrderCard;
