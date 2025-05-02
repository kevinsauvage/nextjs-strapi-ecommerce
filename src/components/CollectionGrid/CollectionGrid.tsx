import CollectionCard from '@/components/CollectionCard';
import SectionTitle from '@/components/SectionTitle';
import type { CollectionsQuery } from '@/shopify/storefront';

import styles from './CollectionGrid.module.scss';

const CollectionGrid = ({
  collections,
}: {
  collections: CollectionsQuery['collections']['edges'];
}) => (
  <section className="mb-20">
    <SectionTitle>Explore our collections</SectionTitle>
    <ul className={styles.grid}>
      {Array.isArray(collections) &&
        collections.map((collection, index) => (
          <li key={collection.node.title + index} className={styles.item}>
            <CollectionCard collection={collection.node} />
          </li>
        ))}
    </ul>
  </section>
);

export default CollectionGrid;
