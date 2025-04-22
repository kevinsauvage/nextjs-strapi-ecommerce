import type { HomePageData } from '@/app/page';
import SectionTitle from '@/components/SectionTitle/SectionTitle';

import CollectionCard from '../../../../components/CollectionCard/CollectionCard';

import styles from './CollectionGrid.module.scss';

const CollectionGrid = ({ collections }: { collections: HomePageData['featuredCollections'] }) => (
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
