import Page from '@/layout/Page/Page';
import { getCollections } from '@/lib/shopify/collection/collectionApiCall';
import CollectionCard from '@/components/CollectionCard/CollectionCard';
import ListDisplay from '@/layout/ListDisplay/ListDisplay';

function CategoryPage({ collections }) {
  return (
    <Page title="Collections">
      <ListDisplay layout="grid">
        {Array.isArray(collections) &&
          collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
      </ListDisplay>
    </Page>
  );
}

export default CategoryPage;

export async function getStaticProps() {
  const collections = await getCollections(50);

  return {
    props: {
      collections,
    },
    revalidate: 60, // In seconds
  };
}
