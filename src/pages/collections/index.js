import Page from '@/layout/Page/Page';
import { getCollections } from '@/lib/shopify/collection/collectionApiCall';
import CollectionGrid from '@/components/scopes/collection/CollectionGrid/CollectionGrid';

function CategoryPage({ collections }) {
  return (
    <Page title="Collections">
      <CollectionGrid collections={collections} />
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
    revalidate: 120, // In seconds
  };
}
