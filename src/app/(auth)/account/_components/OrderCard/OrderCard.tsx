import type {
  OrderFieldsFragment,
  OrderFinancialStatus,
  OrderFulfillmentStatus,
} from '@/shopify/storefront';

import AccountRow from '../AccountRow/AccountRow';

import SuccessfulFulfillments from './SuccessfulFulfillments';

import style from './OrderCard.module.scss';

function formatStatus(status: OrderFulfillmentStatus | OrderFinancialStatus) {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

const getDate = (timestamp: string | number | Date | undefined | null = new Date()) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  };

  const date = new Date(timestamp ?? new Date());
  return date.toLocaleDateString('en-US', options);
};

const OrderCard = ({ order }: { order: OrderFieldsFragment }) => {
  const {
    financialStatus,
    email,
    cancelReason,
    phone,
    fulfillmentStatus,
    totalRefunded,
    totalPrice,

    successfulFulfillments,
  } = order || {};

  return (
    <li className={style.card}>
      <div className={style.header}>
        <h5>Order {order.name}</h5>
      </div>

      <div className={style.detail}>
        <h6>Order information</h6>

        <AccountRow
          content={`${totalRefunded?.amount} ${totalPrice?.currencyCode}`}
          title="Total price"
        />
        {typeof totalRefunded?.amount === 'string' &&
          Number.parseInt(totalRefunded?.amount || '0', 10) > 0 && (
            <AccountRow
              content={`${totalRefunded?.amount} ${totalRefunded?.currencyCode}`}
              title="Total refunded"
            />
          )}
        <AccountRow content={formatStatus(financialStatus)} title="Financial Status" />
        <AccountRow content={formatStatus(fulfillmentStatus)} title="Fulfillment Status" />
        <AccountRow content={email} title="Email" />
        {phone && <AccountRow content={phone} title="Phone" />}
        {typeof order.processedAt === 'string' && (
          <AccountRow content={getDate(order.processedAt)} title="Processed At" />
        )}
        {typeof order.canceledAt === 'string' && typeof cancelReason === 'string' && (
          <>
            <AccountRow content={cancelReason} title="Cancel Reason" />
            <AccountRow content={getDate(order.canceledAt)} title="Canceled At" />
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
