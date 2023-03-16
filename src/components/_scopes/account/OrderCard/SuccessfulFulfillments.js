import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

import HeightAnimation from '@/components/HeightAnimation/HeightAnimation';

import AccountRow from '../AccountRow/AccountRow';

import styles from './SuccessfulFulfillments.module.scss';

const SuccessfulFulfillments = ({ successfulFulfillments }) => (
  <div className={styles.fulfillments}>
    <HeightAnimation
      animationType="button"
      buttonTextActive="Hide tracking information"
      buttonTextInactive="Show tracking information"
    >
      {successfulFulfillments.map((successfulFulfillment, index) => {
        const { trackingInfo, trackingCompany } = successfulFulfillment;
        return (
          <div key={uuidv4()} className={styles.tracks}>
            <h6>Tracking informations {successfulFulfillments.length > 1 && index + 1}</h6>
            <AccountRow content={trackingCompany} title="Tracking Company" />
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

export default SuccessfulFulfillments;
