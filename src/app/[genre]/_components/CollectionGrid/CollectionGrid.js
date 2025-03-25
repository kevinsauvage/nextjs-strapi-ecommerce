import SectionTitle from '@/components/SectionTitle/SectionTitle';

import CollectionCard from '../../../../components/CollectionCard/CollectionCard';

import styles from './CollectionGrid.module.scss';

const CollectionGrid = ({ collections }) => (
  <section>
    <SectionTitle first="FEATURED" second="COLLECTIONS" />
    <ul className={styles.grid}>
      {Array.isArray(collections) &&
        collections.map((collection, index) => (
          <li key={collection.title + index} className={styles.item}>
            <CollectionCard collection={collection} />
          </li>
        ))}
    </ul>
  </section>
);

export default CollectionGrid;
