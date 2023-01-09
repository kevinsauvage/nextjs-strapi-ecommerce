import { getCollections } from '@/lib/shopify/collection/collectionApiCall';
import CollectionGrid from '@/components/_scopes/collection/CollectionGrid/CollectionGrid';
import PageLayout from '@/layout/PageLayout/PageLayout';

function CategoryPage({ collections }) {
  return (
    <PageLayout title="Collections">
      <CollectionGrid collections={collections} />
    </PageLayout>
  );
}

export default CategoryPage;

export async function getStaticProps() {
  const collections = await getCollections(50);

  return {
    props: {
      collections,
    },
    revalidate: 120, // In seconds
  };
}
