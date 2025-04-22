import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

import HeightAnimation from '@/components/HeightAnimation/HeightAnimation';
import type { GetCustomerOrdersQuery } from '@/shopify/storefront';

import AccountRow from '../AccountRow/AccountRow';

import styles from './SuccessfulFulfillments.module.scss';

const SuccessfulFulfillments = ({
  successfulFulfillments,
}: {
  successfulFulfillments: GetCustomerOrdersQuery['customer']['orders']['edges'][number]['node']['successfulFulfillments'][number][];
}) => (
  <div className={styles.fulfillments}>
    <HeightAnimation
      animationType="button"
      buttonTextActive="Hide tracking information"
      buttonTextInactive="Show tracking information"
    >
      {successfulFulfillments.map((successfulFulfillment, index) => {
        const { trackingInfo, trackingCompany } = successfulFulfillment;

        if (!trackingInfo || trackingInfo.length === 0) {
          return <></>;
        }

        return (
          <div key={uuidv4()} className={styles.tracks}>
            <h6>Tracking information {successfulFulfillments.length > 1 && index + 1}</h6>
            <AccountRow content={trackingCompany} title="Tracking Company" />
            {trackingInfo?.map((trackInfo) => {
              if (typeof trackInfo.url === 'string' && trackInfo.url.length > 0) {
                return (
                  <AccountRow
                    key={trackInfo.number}
                    content={<Link href={trackInfo.url}>{trackInfo.number}</Link>}
                    title="Tracking number"
                  />
                );
              }

              return <></>;
            })}
          </div>
        );
      })}
    </HeightAnimation>
  </div>
);

export default SuccessfulFulfillments;
