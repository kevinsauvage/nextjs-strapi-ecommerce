import CollectionCard from '../CollectionCard/CollectionCard';
import styles from './CollectionGrid.module.scss';

function CollectionGrid({ collections }) {
  return (
    <ul className={styles.CollectionGrid}>
      {Array.isArray(collections) &&
        collections.map((collection) => (
          <li key={collection.id} className={styles.item}>
            <CollectionCard collection={collection} />
          </li>
        ))}
    </ul>
  );
}

export default CollectionGrid;
