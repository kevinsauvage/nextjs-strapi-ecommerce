import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

import HeightAnimation from '@/components/HeightAnimation/HeightAnimation';

import AccountRow from '../AccountRow/AccountRow';

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
        <div className={style.bottom}>
          <HeightAnimation
            animationType="button"
            buttonTextActive="Hide tracking information"
            buttonTextInactive="Show tracking information"
          >
            {successfulFulfillments.map((successfulFulfillment, i) => {
              const { trackingInfo } = successfulFulfillment;
              return (
                <div key={uuidv4()} className={style.trackContainer}>
                  <h6>Tracking informations {successfulFulfillments.length > 1 && i + 1}</h6>
                  <AccountRow title="Tracking Company" content={successfulFulfillment?.trackingCompany} />
                  {trackingInfo?.map((trackInfo) => {
                    const { url, number } = trackInfo;
                    return (
                      <AccountRow
                        key={number}
                        title="Tracking number"
                        content={url ? <Link href={url}>{number}</Link> : number}
                      />
                    );
                  })}
                </div>
              );
            })}
          </HeightAnimation>
        </div>
      )}
    </li>
  );
}

export default OrderCard;
