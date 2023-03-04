import SectionTitle from '@/components/SectionTitle/SectionTitle';

import CollectionCard from '../CollectionCard/CollectionCard';

import styles from './CollectionGrid.module.scss';

function CollectionGrid({ collections }) {
  return (
    <section>
      <SectionTitle first="FEATURED" second="COLLECTIONS" />
      <ul className={styles.CollectionGrid}>
        {Array.isArray(collections) &&
          collections.map((collection) => (
            <li key={collection.title} className={styles.item}>
              <CollectionCard collection={collection} />
            </li>
          ))}
      </ul>
    </section>
  );
}

export default CollectionGrid;
