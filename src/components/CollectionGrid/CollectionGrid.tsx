import CollectionCard from '@/components/CollectionCard';
import type { CollectionsQuery } from '@/shopify/storefront';

const CollectionGrid = ({
  collections,
}: {
  collections: CollectionsQuery['collections']['edges'];
}) => {
  if (!Array.isArray(collections) || collections.length === 0) {
    return null;
  }

  return (
    <ul className="collection-grid">
      {collections.map((collection, index) => (
        <li key={collection.node.id || collection.node.title + index} className="collection-grid-item">
          <CollectionCard collection={collection.node} />
        </li>
      ))}
    </ul>
  );
};

export default CollectionGrid;
