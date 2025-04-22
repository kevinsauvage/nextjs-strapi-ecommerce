import type { HomePageData } from '@/app/page';

import CollectionCard from '../CollectionCard/CollectionCard';

import styles from './CollectionBigBanner.module.scss';

const CollectionBigBanner = ({
  collections,
}: {
  collections: HomePageData['bigCardCollections'];
}) => (
  <ul className={styles.banner}>
    {collections.map((collection, index) => (
      <li key={collection.handle + index} className={styles.item}>
        <CollectionCard collection={collection} />
      </li>
    ))}
  </ul>
);

export default CollectionBigBanner;
