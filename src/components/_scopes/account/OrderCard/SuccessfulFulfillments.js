import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

import HeightAnimation from '@/components/HeightAnimation/HeightAnimation';

import AccountRow from '../AccountRow/AccountRow';

import styles from './SuccessfulFulfillments.module.scss';

export default function SuccessfulFulfillments({ successfulFulfillments }) {
  return (
    <div className={styles.SuccessfulFulfillments}>
      <HeightAnimation
        animationType="button"
        buttonTextActive="Hide tracking information"
        buttonTextInactive="Show tracking information"
      >
        {successfulFulfillments.map((successfulFulfillment, i) => {
          const { trackingInfo } = successfulFulfillment;
          return (
            <div key={uuidv4()} className={styles.trackContainer}>
              <h6>Tracking informations {successfulFulfillments.length > 1 && i + 1}</h6>
              <AccountRow content={successfulFulfillment?.trackingCompany} title="Tracking Company" />
              {trackingInfo?.map((trackInfo) => {
                const { url, number } = trackInfo;
                return (
                  <AccountRow
                    key={number}
                    content={url ? <Link href={url}>{number}</Link> : number}
                    title="Tracking number"
                  />
                );
              })}
            </div>
          );
        })}
      </HeightAnimation>
    </div>
  );
}
