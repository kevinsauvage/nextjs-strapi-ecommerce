import CollectionCard from '../../collection/CollectionCard/CollectionCard';
import styles from './CollectionBigBanner.module.scss';

function CollectionBigBanner({ collections }) {
  return (
    <ul className={styles.CollectionBigBanner}>
      {collections.map((collection) => (
        <CollectionCard key={collection.handle} collection={collection} />
      ))}
    </ul>
  );
}

export default CollectionBigBanner;
