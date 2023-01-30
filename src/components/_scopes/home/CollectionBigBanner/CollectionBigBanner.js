import CollectionCard from '../../collection/CollectionCard/CollectionCard';
import styles from './CollectionBigBanner.module.scss';

function CollectionBigBanner({ collections }) {
  return (
    <ul className={styles.CollectionBigBanner}>
      {collections.map((collection) => (
        <li key={collection.handle} className={styles.item}>
          <CollectionCard collection={collection} />
        </li>
      ))}
    </ul>
  );
}

export default CollectionBigBanner;
